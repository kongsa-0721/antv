import { Graph, Path, Markup } from '@antv/x6'

//注册自定义节点类型
Graph.registerNode(
	'nodeDB',
	{
		inherit: 'rect', //矩形节点
		attrs: {
			label: {
				fontSize: 14, // 定义节点相关的文本属性
				fill: '#262626'
			},
			body: {
				rx: 6, // rect支持 圆角矩形
				ry: 6,
				stroke: '#5F95FF',
				fill: '#EFF4FF',
				strokeWidth: 1
			}
		}
	},
	true
)

//注册自定义连线类型
Graph.registerConnector(
	'dbTodb',
	(sourcePoint, targetPoint, options: any) => {
		const midX = sourcePoint.x + 10
		const midY = sourcePoint.y
		const ctrX = (targetPoint.x - midX) / 5 + midX
		const ctrY = targetPoint.y
		const pathData = `
                     M ${sourcePoint.x} ${sourcePoint.y}
                     L ${midX} ${midY}
                     Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
                    `
		return options.raw ? Path.parse(pathData) : pathData
	},
	true
)

//注册了对应的边
Graph.registerEdge(
	'columnEdge',
	{
		defaultLabel: {
			markup: Markup.getForeignObjectMarkup(), // 获取外部对象标记的标记字符串
			attrs: {
				fo: {
					width: 120, //根据fo来确定位置
					height: 30,
					x: 60,
					y: -15
				}
			}
		},
		label: {
			position: {
				distance: 0.1,
				options: {
					keepGradient: true
				}
			}
		},
		inherit: 'edge', //继承普通连线
		connector: {
			name: 'dbTodb'
		},
		attrs: {
			line: {
				targetMarker: '',
				stroke: 'orange',
				strokeWidth: 2
			}
		},
		zIndex: 0
	},
	true
)

export const apiData = {
	vtableNode: {
		projectId: 1,
		tableName: 'table1',
		filter: 'none',
		childLinks: [{}],
		children: [
			{
				projectId: 2,
				tableName: 'table2',
				filter: 'none',
				childLinks: [{}],
				children: [
					{
						projectId: 3,
						tableName: 'table3',
						filter: 'none',
						childLinks: [{}],
						children: [] //小心坑，如果是空数组，才可以approve
					}
				]
			},
			{
				projectId: 4,
				tableName: 'table4',
				filter: 'none',
				childLinks: [{}],
				children: [
					{
						projectId: 5,
						tableName: 'table5',
						filter: 'none',
						childLinks: [{}],
						children: []
					}
				]
			}
		]
	},
	links: [
		{
			sourceTableName: 'string',
			targetTableName: 'string',
			joinType: 'string',
			joinKeys: [
				{
					sourceKey: 'string',
					targetKey: 'string',
					condition: 'string'
				}
			]
		}
	]
}

export { Graph as customGraph }
