import dagre from 'dagre';

const nodeWidth = 150;
const nodeHeight = 100;

export const processData = (data, handleEdit, handleDelete, handleAddChild) => {
    const nodes = [];
    const edges = [];
  
    const traverse = (item, parentId = null) => {
      nodes.push({
        id: item.id.toString(),
        type: 'customNode',
        data: {
          id: item.id,
          label: item.name,
          parent_id: parentId, 
          isActive: item.is_active,
          isDeleted: item.is_deleted,
          isApproved: item.is_approved,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onAddChild: handleAddChild,
        },
        position: { x: 0, y: 0 },
      });
  
      if (parentId) {
        edges.push({
          id: `e${parentId}-${item.id}`,
          source: parentId.toString(),
          target: item.id.toString(),
          animated: true,
          type: 'step'
        });
      }
  
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          traverse(child, item.id);
        });
      }
    };
  
    data.forEach((item) => {
      traverse(item);
    });
  
    return { nodes, edges };
  };

export const getLayoutedElements = (nodes, edges, dagreGraph) => {
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};