import * as React from 'react'
import { Cell } from '@antv/x6'
import { Button } from 'antd'
import Hierarchy from '@antv/hierarchy'
import { apiData, customGraph } from './conf'
import { MindMapProps, RootProps } from './typing'
import { treeDataToGraphTreeData } from './utils'

function RootGraph() {
	// 容器 存放graph实例
	const globalGraph = React.useRef<customGraph>()
	const globalData = React.useRef<RootProps | null>()
	// 组件渲染之后挂载graph
	React.useEffect(() => {
		const graph = new customGraph({
			container: document.getElementById('container') as HTMLDivElement,
			height: 600,
			width: 800,
			background: {
				color: '#fffbe6'
			},
			grid: {
				size: 10,
				visible: true
			}
		})
		globalGraph.current = graph
		return () => {
			globalGraph.current?.clearCells()
		}
	}, [])

	/**
	 * 获取值之后重新渲染
	 * 不需要fromJson 因为我们在这里createNode
	 */
	function rerender() {
		const graph = globalGraph.current
		const result: any = Hierarchy.mindmap(globalData.current, {
			direction: 'H', //https://github.com/antvis/hierarchy
			getHeight: (node: MindMapProps) => node.height,
			getWidth: (node: MindMapProps) => node.width,
			getHGap: () => 40, //     水平
			getVGap: () => 40, //节点间垂直距离
			getSide: () => 'right'
		})
		console.log(result)

		const cells: Cell[] = []
		// 创建出新的根节点，连线等。
		function create(HierarchyItem: any) {
			if (HierarchyItem) {
				const { data, children } = HierarchyItem
				cells.push(
					(graph as customGraph).createNode({
						id: data.projectId,
						shape: 'nodeDB',
						x: HierarchyItem.x,
						y: HierarchyItem.y,
						width: data.width,
						height: data.height,
						label: data.tableName,
						type: 'rect'
					})
				)
				if (children && children.length > 0) {
					children.forEach((child: any) => {
						const { id } = child
						cells.push(
							(graph as customGraph).createEdge({
								shape: 'columnEdge',
								source: {
									cell: HierarchyItem.id,
									anchor:
										// {
										// 	name: 'center',
										// 	args: {
										// 		dx: '25%'
										// 	}
										// }
										{
											name: 'right',
											args: {
												dx: -16
											}
										}
								},
								target: {
									cell: id,
									anchor: {
										name: 'left'
									}
								}
							})
						)
						create(child)
					})
				}
			}
		}
		create(result)
		// rerender 不需要 graph?.clearCells()
		graph?.resetCells(cells)
		graph?.centerContent()
	}
	// 获取到api的返回值，转化为对应的数据结构，调用rerender 重新渲染。
	function renderGraph() {
		globalData.current = treeDataToGraphTreeData(Object.assign({}, apiData.vtableNode) as any, 'nodeDB')
		console.log(globalData.current)
		rerender()
	}
	function clear() {
		globalGraph.current?.clearCells()
	}
	return (
		<>
			<Button onClick={renderGraph}>rerender</Button>
			<Button onClick={clear}>clear</Button>
			<div id='container'>graph</div>
		</>
	)
}

export default RootGraph
