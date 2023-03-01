import { Graph, Path, Markup, Point } from '@antv/x6'

//注册自定义节点类型
Graph.registerNode(
	'nodeDB',
	{
		inherit: 'rect', //矩形节点
		attrs: {
			label: {
				fontSize: 14, // 定义节点相关的文本属性
				fill: '#999999'
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
	(
		sourcePoint: Point.PointLike,
		targetPoint: Point.PointLike,
		routePoints: Point.PointLike[],
		args: { spread?: number; raw?: boolean }
	) => {
		console.log(sourcePoint, targetPoint, routePoints, args)

		const midX = sourcePoint.x + 5
		const midY = sourcePoint.y
		const points: string[] = []

		points.push(`M ${sourcePoint.x} ${sourcePoint.y}`)
		points.push(`L ${midX} ${midY}`)

		const length = routePoints.length
		for (let i = 0; i < length; i++) {
			const point = routePoints[i]
			points.push(`L ${point.x} ${point.y}`)
		}

		const lastPoint = routePoints[length - 1] || sourcePoint
		const distance = targetPoint.x - lastPoint.x
		const endX = lastPoint.x + Math.min(30, distance / 2)

		points.push(`M ${lastPoint.x} ${lastPoint.y}`)
		points.push(`L ${endX} ${lastPoint.y}`)
		points.push(`L ${endX} ${targetPoint.y}`)
		points.push(`L ${targetPoint.x} ${targetPoint.y}`)

		return Path.parse(points.join(' '))
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
		router: {
			name: 'orth',
			args: {
				offset: 'left'
			}
		},
		inherit: 'edge', //继承普通连线
		connector: { name: 'normal' },
		attrs: {
			line: {
				stroke: '#A2B1ff',
				sourceMarker: '', // 实心箭头
				targetMarker: {
					name: 'block'
				}
			}
		},
		zIndex: 0
	},
	true
)

export const virtualTableList = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), name: `table${i}` }))

export const joinTypeList = [
	{ label: '左外连接', value: 'left_outer_join' },
	{ label: '内连接', value: 'inner_join' },
	{ label: '全连接', value: 'full_join' },
	{ label: '连接', value: 'join' }
] as const

export const tableColumns = Array.from({ length: 20 }, (_, i) => ({ columns: `column${i.toString()}` }))

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
