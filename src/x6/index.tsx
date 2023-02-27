import React, { useState, useRef, useEffect } from 'react'
import { Cell } from '@antv/x6'
import { Button, Select } from 'antd'
import Hierarchy from '@antv/hierarchy'
import { apiData, customGraph, virtualTableList } from './conf'
import { MindMapProps, RootProps } from './typing'
import { treeDataToGraphTreeData } from './utils'

function RootGraph() {
	// 容器 存放graph实例
	const globalGraph = useRef<customGraph>()
	const globalData = useRef<RootProps | null>()
	// 根节点，选中的节点
	const [sourceNode, setSourceNode] = useState()
	const [targetNode, setTargetNode] = useState()
	const [sourceNodeList, setSourceNodeList] = useState()
	const [targetNodeList, setTargetNodeList] = useState()
	// 记录 links
	const [links, setLinks] = useState([])
	// 修改的data
	const [buildData, setBuildData] = useState()
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
	// 这个地方我们只在根节点转换的时候调用。
	function renderGraph(data: RootProps) {
		globalData.current = treeDataToGraphTreeData(Object.assign({}, data) as any, 'nodeDB')
		console.log(globalData.current)
		rerender()
	}
	function clear() {
		globalGraph.current?.clearCells()
	}
	return (
		<>
			<Select
				style={{ width: 300 }}
				onChange={(tableId: number) => {
					const { name, id } = virtualTableList.find((i) => i.id === tableId) ?? {}
					// TODO 使用更安全的类型
					renderGraph({ projectId: id ?? 0, tableName: name ?? '', children: [] })
				}}
				options={virtualTableList.map((e) => ({ label: e.name, value: e.id }))}
			/>
			<Button onClick={clear}>clear</Button>
			<div id='container'>graph</div>
		</>
	)
}

export default RootGraph
