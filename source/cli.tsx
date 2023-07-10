#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
    `
	Usage
	  $ auto-bi

	Options
		--name  Your name

	Examples
	  $ auto-bi --name=Jane
	  Hello, Jane
`,
    {
        importMeta: import.meta,
        flags: {
            httpUrl: {
                type: 'string',
            },
            httpMethod: {
                type: 'string',
            },
            httpHeader: {
                type: 'string',
            },
            httpParams: {
                type: 'string',
            },
            httpBody: {
                type: 'string',
            },
            httpDataPath: {
                type: 'string',
            },
            httpLoop: {
                // 并发多次查询
                type: 'string'
            },
            httpLoopKey: {
                type: 'string'
            },
            dataGroupByKey: {
                // 多次查询后的数据聚合
                type: 'string'
            },
            dataColumns: {
                type: 'string',
            }
        },
    },
);

const { httpHeader, dataColumns, httpLoop, ...others } = cli.flags

render(
    <App
        {...others}
        httpHeader={httpHeader ? JSON.parse(httpHeader) : {}}
        httpLoop={httpLoop ? JSON.parse(httpLoop): []}
        dataColumns={dataColumns ? JSON.parse(dataColumns) : []}
    />
);
