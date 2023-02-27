import { RootProps } from './typing'

export const treeDataToGraphTreeData = (root: RootProps, type: string) => {
	if (!root) return null
	// 在root上添加了一些属性
	Object.assign(root, {
		id: root.id,
		type,
		label: root.name,
		width: root.name?.length * 20 || 60,
		height: 40
	})
	if (root.children?.length && root.children.length > 0) {
		root.children = root.children?.map((childRoot: RootProps) => {
			return treeDataToGraphTreeData(childRoot, type) as RootProps
		})
	}
	return root
}

export const findItem = (obj: RootProps, id: string): { parent: RootProps | null; node: RootProps } | null => {
	if (obj.id === id) {
		return {
			parent: null,
			node: obj
		}
	}

	if (obj.children) {
		for (let i = 0, len = obj.children.length; i < len; i++) {
			const res = findItem(obj.children[i], id)
			if (res) {
				return {
					parent: obj,
					node: res.node
				}
			}
		}
	}

	return null
}

const addChildNode = (data: RootProps, id: string, childrenTable: string): RootProps | null => {
	const res = findItem(data, id)
	if (!res) {
		return null
	}
	const dataItem = res.node
	if (!dataItem.children) {
		dataItem.children = []
	}
	const item: RootProps = {
		id: childrenTable,
		name: childrenTable,
		width: 100,
		height: 40
	}
	dataItem.children.push(item)
	return item
}

const changeNode = (data: RootProps, id: string, changeTable: Partial<RootProps>): RootProps | null => {
	const res = findItem(data, id)
	if (!res) return null

	const dataItem = res.node

	Object.assign(dataItem, changeTable)
	return dataItem
}

export const removeNode = (data: RootProps, id: string): RootProps[] | null => {
	const res = findItem(data, id)
	if (!res) return null
	const { parent, node } = res
	if (!parent || !parent.children || !node) return null
	const { children } = parent
	const index = children.findIndex((item) => item.id === id)
	if (index === -1) return null
	return children.splice(index, 1)
}
