interface MindMapProps {
	children: MindMapProps[]
	width: number
	height: number
	id: number
	label: number
	type: 'nodeDB'
}
interface RootProps {
	id: string
	name: string
	label?: string
	width?: number
	height?: number
	children?: Array<RootProps>
}

export type { MindMapProps, RootProps }
