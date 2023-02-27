import { RootProps } from './typing'

export const treeDataToGraphTreeData = (root: RootProps, type: string) => {
	if (!root) {
		return null
	}
	// 在root上添加了一些属性
	Object.assign(root, {
		id: root.projectId,
		type,
		label: root.tableName,
		width: root.tableName?.length * 10 || 60,
		height: 40
	})
	if (root.children?.length && root.children.length > 0) {
		root.children = root.children?.map((childRoot: any) => {
			return treeDataToGraphTreeData(childRoot, type)
		})
	}
	return root
}
