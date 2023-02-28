import { RootProps } from './typing'

export const treeDataToGraphTreeData = (root: RootProps, type: string) => {
	if (!root) return null
	// 在root上添加了一些属性
	Object.assign(root, {
		id: root.label,
		type,
		label: root.label,
		width: root.label?.length * 20 || 60,
		height: 40
	})
	if (root.children?.length && root.children.length > 0) {
		root.children = root.children.map((childRoot: RootProps) => {
			return treeDataToGraphTreeData(childRoot, type) as RootProps
		})
	}
	return root
}

const findNode = (obj: RootProps, id: string): { parent: RootProps | null; node: RootProps } | null => {
	if (obj.id === id) {
		return {
			parent: null,
			node: obj
		}
	}

	if (obj.children) {
		for (let i = 0, len = obj.children.length; i < len; i++) {
			const res = findNode(obj.children[i], id)
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
	console.log('执行 addchild node')

	const res = findNode(data, id)
	if (!res) {
		return null
	}
	const dataItem = res.node
	if (!dataItem.children) {
		dataItem.children = []
	}
	const item: RootProps = {
		id: childrenTable,
		label: childrenTable,
		width: 100,
		height: 40
	}
	dataItem.children.push(item)
	return item
}

const updateNode = (data: RootProps, id: string, changeTable: Partial<RootProps>): RootProps | null => {
	console.log('执行 update node')

	const res = findNode(data, id)
	if (!res || !res.node) return null

	const dataItem = res.node

	Object.assign(dataItem, changeTable)
	return dataItem
}

const removeNode = (data: RootProps, id: string): RootProps[] | null => {
	const res = findNode(data, id)
	if (!res) return null
	const { parent, node } = res
	if (!parent || !parent.children || !node) return null
	const { children } = parent
	const index = children.findIndex((item) => item.id === id)
	if (index === -1) return null
	return children.splice(index, 1)
}

function hasId(root: RootProps, id: string): boolean {
	if (root.id === id) {
		return true
	}
	if (root.children) {
		for (let i = 0; i < root.children.length; i++) {
			if (hasId(root.children[i], id)) {
				return true
			}
		}
	}
	return false
}

export { findNode, addChildNode, updateNode, removeNode, hasId }
