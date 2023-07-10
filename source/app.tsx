import React, { useEffect, useState } from 'react';
import Table from './components/Table.js';
import { useApp } from 'ink';
import fetch from 'node-fetch';
import _ from 'lodash';
import handlebars from 'handlebars'
const { compile } = handlebars

export default function App(props: {
	httpUrl?: string;
	httpMethod?: string;
	httpHeader?: HeadersInit;
	httpParams?: string;
	httpBody?: string;
	httpDataPath?: string;
	httpLoop?: Record<string, any>[]
	httpLoopKey?: string
	dataColumns?: { title: string; dataIndex: string }[];
	dataGroupByKey?: string;
}) {
	const { exit } = useApp()

	const [data, setData] = useState<any[]>([])

	const { httpUrl, httpMethod, httpHeader, httpParams, httpBody,
		httpDataPath, httpLoop, httpLoopKey, dataGroupByKey } = props

	useEffect(() => {

		// 获取数据，目前版本仅支持 HTTP 获取、内存存储
		let loop = httpLoop || [{}]
		Promise.all(loop.map((l) => {

			if (!httpUrl) throw Error('请输入数据源请求地址')
			const url = new URL(httpUrl)
			url.search = httpParams ? new URLSearchParams(
				compile(httpParams)(l)
			).toString() : ''

			return fetch(httpUrl, {
				method: httpMethod || 'GET',
				body: compile(httpBody)(l),
				headers: httpHeader,
			}).then(res => res.json())
		}))
			.then((allData) => {
				let finalData: any[] = _.flatten(
					allData.map((data, index) => {
						return _.get(data, httpDataPath || '').map((item: any) => ({ ...item, ...loop[index] }))
					})
				)
				if (dataGroupByKey) {
					const tmp: any = _.groupBy(finalData, dataGroupByKey)
					finalData = Object.keys(tmp).map(key => {
						const t: any = {}
						tmp[key].forEach((d: any) => {
							Object.keys(d).forEach(k => {
								if (httpLoopKey && k !== dataGroupByKey && k !== httpLoopKey) {
									t[`${d[httpLoopKey]}(${k})`] = d[k]
								} else if (k === dataGroupByKey) {
									// 聚合列
									t[k] = d[k]
								}
							})
						})
						return t
					})
				}
				finalData = _.orderBy(finalData, dataGroupByKey)
				setData(finalData)
				exit();
			})
	}, [])

	const dataFinal = data.map(item => {
		const result: Record<string, string> = {}
		Object.keys(item).forEach(k => {
			if (props.dataColumns?.find(i => k === i.dataIndex || k.includes(`(${i.dataIndex})`)))
				result[k] = item?.[k]
		})
		return result
	})

	return (
		<Table data={dataFinal} />
	);
}
