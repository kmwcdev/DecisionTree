import { useCallback } from 'react';
import { EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import { useTreeStore } from '../../../store/useTreeStore';
import type { LaborEdgeData } from '../../../types';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
  label,
  markerEnd,
  style,
}: EdgeProps<LaborEdgeData>) {
  const { mode, darkMode, updateEdge, setSelection } = useTreeStore();
  const { getZoom } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
    ...(data?.bendX !== undefined && { centerX: data.bendX }),
    ...(data?.bendY !== undefined && { centerY: data.bendY }),
  });

  const onLineMouseDown = useCallback(
    (evt: React.MouseEvent<SVGPathElement>) => {
      if (mode !== 'editor') return;
      evt.stopPropagation();
      setSelection({ type: 'edge', id });

      // Convert click position from screen → canvas coordinates via SVG matrix
      const svgEl = evt.currentTarget.ownerSVGElement!;
      const pt = svgEl.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      const canvas = pt.matrixTransform(svgEl.getScreenCTM()!.inverse());

      // Determine which segment type was clicked:
      // within 25px of the horizontal middle → horizontal segment (drag Y)
      // otherwise → vertical segment (drag X)
      const currentCenterY = data?.bendY ?? (sourceY + targetY) / 2;
      const currentCenterX = data?.bendX ?? (sourceX + targetX) / 2;
      const isHorizontalSegment = Math.abs(canvas.y - currentCenterY) < 25;

      const zoom = getZoom();
      let cx = currentCenterX;
      let cy = currentCenterY;
      let prevX = evt.clientX;
      let prevY = evt.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const dx = (e.clientX - prevX) / zoom;
        const dy = (e.clientY - prevY) / zoom;
        prevX = e.clientX;
        prevY = e.clientY;
        if (isHorizontalSegment) {
          cy += dy;
          updateEdge(id, { bendY: cy });
        } else {
          cx += dx;
          updateEdge(id, { bendX: cx });
        }
        document.body.style.cursor = 'grabbing';
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [
      mode, id,
      data?.bendX, data?.bendY,
      sourceX, sourceY, targetX, targetY,
      updateEdge, setSelection, getZoom,
    ]
  );

  const labelStr = typeof label === 'string' ? label : undefined;

  return (
    <>
      {/* Visible styled path */}
      <path
        d={edgePath}
        fill="none"
        style={style}
        markerEnd={markerEnd as string}
      />

      {/* Wide transparent overlay — grab anywhere on the line */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={16}
        stroke="transparent"
        style={{ cursor: mode === 'editor' ? 'grab' : 'default' }}
        onMouseDown={onLineMouseDown}
      />

      {labelStr && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
              fontSize: 10,
              fontWeight: 600,
              background: darkMode ? '#1f2937' : 'white',
              padding: '1px 5px',
              borderRadius: 4,
              color: darkMode ? '#9ca3af' : '#6b7280',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              whiteSpace: 'nowrap',
            }}
          >
            {labelStr}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
