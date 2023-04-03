import { PageHeader } from '@ant-design/pro-layout'
import { Divider } from 'antd'

export const Header = () => {
	return (
		<div style={{ background: '#d1e0f4', height: 600, width: 600 }}>
			<PageHeader style={{ border: '1px solid #000' }} ghost={false} title={'sdafasdfsf'}>
				<Divider />
				<Comp />
			</PageHeader>
		</div>
	)
}

const Comp = () => {
	return (
		<>
			<div style={{ height: 50, width: '100%', background: 'red' }}></div>
		</>
	)
}
