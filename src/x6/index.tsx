import { useState, useRef, useEffect } from 'react'
import { Cell, Node, Edge } from '@antv/x6'
import { Button, Select } from 'antd'
import Hierarchy from '@antv/hierarchy'
import { apiData, customGraph, virtualTableList } from './conf'
import { MindMapProps, RootProps } from './typing'
import { treeDataToGraphTreeData, findNode, addChildNode, changeNode, removeNode } from './utils'

function RootGraph() {
	// 容器 存放graph实例
	const globalGraph = useRef<customGraph>()
	const globalData = useRef<RootProps | null>()
	// 根节点，选中的节点
	const [sourceNode, setSourceNode] = useState()
	const [targetNode, setTargetNode] = useState()
	const [sourceNodeList, setSourceNodeList] = useState()
	const [targetNodeList, setTargetNodeList] = useState()
	//选中的节点
	const selectedNodeId = useRef<string>('')
	// 记录 links
	const [links, setLinks] = useState([])
	// 组件渲染之后挂载graph
	useEffect(() => {
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
	useEffect(() => {
		globalGraph.current?.on('node:mouseenter', ({ node }) => {
			// 配置节点间关系
			node.addTools({
				name: 'button',
				args: {
					markup: [
						{
							tagName: 'circle',
							selector: 'button',
							attrs: {
								r: 8,
								stroke: '#1890ff',
								'stroke-width': 1,
								fill: 'white',
								cursor: 'pointer'
							}
						},
						{
							tagName: 'text',
							textContent: '···',
							selector: 'icon',
							attrs: {
								fill: '#1890ff',
								'font-size': 10,
								'font-weight': 500,
								'text-anchor': 'middle',
								'pointer-events': 'none',
								y: '0.3em'
							}
						}
					],
					x: '100%',
					y: '100%',
					offset: { x: -13, y: -20 },
					onClick({ cell }: { cell: Node | Edge }) {
						//获取到当前这个节点的ID,也是tableID
						selectedNodeId.current = cell.id
						console.log(cell.id)
					}
				}
			})
		})
		// 鼠标移开时删除删除按钮
		globalGraph.current?.on('node:mouseleave', ({ node }) => {
			node.removeTool('button')
		})
		return () => {
			globalGraph.current?.clearCells()
		}
	}, [links, virtualTableList])
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
		const cells: Cell[] = []
		// 创建出新的根节点，连线等。
		function create(HierarchyItem: any) {
			if (HierarchyItem) {
				const { data, children } = HierarchyItem
				cells.push(
					(graph as customGraph).createNode({
						id: data.id,
						shape: 'nodeDB',
						x: HierarchyItem.x,
						y: HierarchyItem.y,
						width: data.width,
						height: data.height,
						label: data.name,
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
	// 这个地方我们只在根节点转换的时候调用。
	function renderGraph(data: RootProps) {
		globalData.current = treeDataToGraphTreeData(Object.assign({}, data) as any, 'nodeDB')
		rerender()
	}
	return (
		<>
			选择根节点
			<Select
				style={{ width: 300 }}
				onChange={(tableId: string) => {
					const { name, id } = virtualTableList.find((i) => i.id === tableId) as { id: string; name: string }
					// TODO 使用更安全的类型
					renderGraph({ id: id ?? '', name: name ?? '', children: [] })
				}}
				options={virtualTableList.map((e) => ({ label: e.name, value: e.id }))}
			/>
			{/* 渲染graph */}
			<div id='container' />
		</>
	)
}

export default RootGraph
