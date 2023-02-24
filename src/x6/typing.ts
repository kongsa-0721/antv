interface MindMapProps {
	children: MindMapProps[]
	width: number
	height: number
	id: number
	label: number
	type: 'nodeDB'
}
interface RootProps {
	projectId: number
	tableName: string
	width?: number
	height?: number
	children: Array<RootProps | null>
}

export type { MindMapProps, RootProps }
