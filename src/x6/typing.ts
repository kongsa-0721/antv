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
	label: string
	width?: number
	height?: number
	children?: Array<RootProps>
}

interface LinksProps {
	sourceTableName: string
	targetTableName: string
	joinType: 'left join'
	joinKeys: Array<JoinKeysProps>
}

interface JoinKeysProps {
	sourceKey: string
	targetKey: string
	condition: string
}

export type { MindMapProps, RootProps, LinksProps, JoinKeysProps }
