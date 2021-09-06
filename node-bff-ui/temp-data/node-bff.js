/*
 Navicat MongoDB Data Transfer

 Source Server         : 本地
 Source Server Type    : MongoDB
 Source Server Version : 40404
 Source Host           : localhost:27017
 Source Schema         : node-bff

 Target Server Type    : MongoDB
 Target Server Version : 40404
 File Encoding         : 65001

 Date: 04/06/2021 18:12:58
*/


// ----------------------------
// Collection structure for apis
// ----------------------------
db.getCollection("apis").drop();
db.createCollection("apis");

// ----------------------------
// Documents of apis
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("node-bff");
db.getCollection("apis").insert([ {
    _id: ObjectId("60a50642bcf8c16cd9eb1a12"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-19T12:28:56.831Z"),
    name: "111",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60a50642bcf8c16cd9eb1a11"),
    createdBy: "admin",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60a6215d86f8c37388d7f77c"),
    urlParams: [
        {
            key: 1621500169679,
            paramName: "aaa",
            required: true,
            remark: ""
        }
    ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-20T08:41:40.221Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/test1",
    description: "111",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60a6215d86f8c37388d7f77b"),
    createdBy: "admin",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60a62dc6998a757a572df2dd"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-20T09:27:11.75Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/test1",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "admin",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60a65007998a757a572df2de"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        }
    ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-20T09:27:11.75Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/test2",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.1",
    versionMessage: "212",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "admin",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60ab1315998a757a572df2df"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: ""
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-20T09:27:11.75Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注",
    bodyType: NumberInt("1"),
    version: "1.0.2",
    versionMessage: "123",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "admin",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60ac5b47998a757a572df2e0"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: "",
            custom: false
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-05-20T09:27:11.75Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注",
    bodyType: NumberInt("1"),
    version: "1.0.3",
    versionMessage: "123",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "admin",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60af63c0e0e7d3a1869265fe"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: "",
            custom: false
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-05-27T05:46:30.005Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注1",
    bodyType: NumberInt("1"),
    version: "1.0.4",
    versionMessage: "sdfsdf",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzh",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60af6434e0e7d3a1869265ff"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: "",
            custom: false
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-05-27T05:46:30.005Z"),
    name: "测试接口1",
    category: null,
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.5",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b09cba6bdc88dae0d97029"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "001",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/001",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60b09cba6bdc88dae0d97028"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b09cc86bdc88dae0d9702b"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "002",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/002",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b09cc86bdc88dae0d9702a"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b09cd56bdc88dae0d9702d"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "003",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/003",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b09cd56bdc88dae0d9702c"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b09ce96bdc88dae0d9702f"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "004",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/004",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b09ce96bdc88dae0d9702e"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c1c36bdc88dae0d97031"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "005",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/005",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60b1c1c36bdc88dae0d97030"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c1e96bdc88dae0d97032"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "005",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/005",
    description: "1",
    bodyType: NumberInt("0"),
    version: "1.0.1",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b1c1c36bdc88dae0d97030"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c29a6bdc88dae0d97033"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-28T06:48:06.878Z"),
    name: "001",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/001",
    description: "1",
    bodyType: NumberInt("0"),
    version: "1.0.1",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60b09cba6bdc88dae0d97028"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c3416bdc88dae0d97034"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-29T04:29:53.515Z"),
    name: "001",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/001",
    description: "12",
    bodyType: NumberInt("0"),
    version: "1.0.2",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b09cba6bdc88dae0d97028"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c3596bdc88dae0d97036"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-29T04:30:17.869Z"),
    name: "006",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/006",
    description: "11",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b1c3596bdc88dae0d97035"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c8ddb6a9a90140125090"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-29T04:53:49.923Z"),
    name: "007",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/007",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b1c8ddb6a9a9014012508f"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b1c8ebb6a9a90140125092"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-29T04:54:03.473Z"),
    name: "008",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/008",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60b1c8ebb6a9a90140125091"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b2165400560f4dea70f07c"),
    urlParams: [ ],
    jsonParams: [ ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-05-29T10:24:20.085Z"),
    name: "008",
    category: ObjectId("60b1ff116cd4b22fc1fc4dc8"),
    status: NumberInt("0"),
    method: "get",
    path: "/008",
    description: "",
    bodyType: NumberInt("0"),
    version: "1.0.1",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b1c8ebb6a9a90140125091"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b48f53ced5c5724d88da38"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: "",
            custom: false
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-05-31T07:25:07.08Z"),
    name: "测试接口1",
    category: ObjectId("60b08fccb10366d879a6ac2d"),
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.6",
    versionMessage: "1111",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b5a0377d6f577a5f3ae0a7"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 1622515732783,
                    parentKey: 1621823979640,
                    paramName: "param5",
                    type: "array",
                    required: true,
                    children: [
                        {
                            key: 1622515742797,
                            parentKey: 1622515732783,
                            paramName: "item",
                            required: false,
                            type: "string",
                            children: null
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [ ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: "",
            custom: false
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-06-01T02:49:27.817Z"),
    name: "测试接口1",
    category: ObjectId("60b08fccb10366d879a6ac2d"),
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.7",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b5c3b27d6f577a5f3ae0a8"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 1622515732783,
                    parentKey: 1621823979640,
                    paramName: "param5",
                    type: "array",
                    required: true,
                    children: [
                        {
                            key: 1622515742797,
                            parentKey: 1622515732783,
                            paramName: "item",
                            required: false,
                            type: "string",
                            children: null
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [
        {
            key: 1622524790327,
            paramName: "Content-Type",
            required: true
        }
    ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n}",
            comment: "",
            custom: false
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-06-01T05:20:50.558Z"),
    name: "测试接口1",
    category: ObjectId("60b08fccb10366d879a6ac2d"),
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.8",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b5c3f47d6f577a5f3ae0aa"),
    urlParams: [
        {
            key: 1622524898899,
            paramName: "param1",
            required: true,
            remark: ""
        }
    ],
    jsonParams: [ ],
    formParams: [
        {
            key: 1622524906247,
            paramName: "aaa",
            required: false,
            remark: "123"
        },
        {
            key: 1622524908881,
            paramName: "bbb",
            required: true,
            remark: "222"
        }
    ],
    headerParams: [
        {
            key: 1622524905095,
            paramName: "Content-Type",
            required: true
        }
    ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: NumberInt("999"),
            type: "handler",
            custom: false,
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: ""
        }
    ],
    createdTime: ISODate("2021-06-01T05:21:56.973Z"),
    name: "测试接口2 - formData",
    category: null,
    status: NumberInt("0"),
    method: "get",
    path: "/test2",
    description: "111",
    bodyType: NumberInt("2"),
    version: "1.0.0",
    versionMessage: "111",
    versionActive: true,
    versionThread: ObjectId("60b5c3f47d6f577a5f3ae0a9"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b990767d6f577a5f3ae0ab"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 1622515732783,
                    parentKey: 1621823979640,
                    paramName: "param5",
                    type: "array",
                    required: true,
                    children: [
                        {
                            key: 1622515742797,
                            parentKey: 1622515732783,
                            paramName: "item",
                            required: false,
                            type: "string",
                            children: null
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [
        {
            key: 1622524790327,
            paramName: "Content-Type",
            required: true
        }
    ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n  context.$request.path\n}",
            comment: "这是函数备注\n哈哈",
            custom: true
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "get",
                    path: "/get/api1",
                    pathParams: [ ],
                    urlParams: [ ],
                    bodyType: NumberInt("0"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {};\n}",
                    formParams: [ ],
                    headerParams: [ ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-06-04T02:31:18.374Z"),
    name: "测试接口1",
    category: ObjectId("60b08fccb10366d879a6ac2d"),
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.9",
    versionMessage: "111",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b9c783e4a58639b431f888"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 1622515732783,
                    parentKey: 1621823979640,
                    paramName: "param5",
                    type: "array",
                    required: true,
                    children: [
                        {
                            key: 1622515742797,
                            parentKey: 1622515732783,
                            paramName: "item",
                            required: false,
                            type: "string",
                            children: null
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [
        {
            key: 1622524790327,
            paramName: "Content-Type",
            required: true
        }
    ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n  context.$request.path\n}",
            comment: "这是函数备注\n哈哈",
            custom: true
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "post",
                    path: "/get/api1/:id",
                    pathParams: [
                        {
                            key: "id",
                            paramName: "id",
                            paramValue: "context.$request.query.param2",
                            valType: "expression"
                        }
                    ],
                    urlParams: [
                        {
                            key: 1622787843183,
                            paramName: "aaa",
                            paramValue: "123",
                            valType: "fixed"
                        },
                        {
                            key: 1622787850343,
                            paramName: "bbb",
                            paramValue: "context.$request.query.param1",
                            valType: "fixed"
                        }
                    ],
                    bodyType: NumberInt("1"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {\n    name: context.$request.body.abc,\n  };\n}",
                    formParams: [ ],
                    headerParams: [
                        {
                            key: 1622787926659,
                            paramName: "Content-Type",
                            valType: "fixed",
                            paramValue: "application/json"
                        }
                    ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-06-04T06:26:11.195Z"),
    name: "测试接口1",
    category: ObjectId("60b08fccb10366d879a6ac2d"),
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.10",
    versionMessage: "123",
    versionActive: false,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("apis").insert([ {
    _id: ObjectId("60b9da9ce4a58639b431f889"),
    urlParams: [
        {
            key: 1621512164708,
            paramName: "param1",
            required: true,
            remark: "111"
        },
        {
            key: 1621512179932,
            paramName: "param2",
            required: false,
            remark: "222"
        },
        {
            key: 1621823966936,
            paramName: "param3",
            required: false,
            remark: "333"
        }
    ],
    jsonParams: [
        {
            key: 1621823979640,
            parentKey: NumberInt("0"),
            paramName: "root",
            required: false,
            type: "object",
            children: [
                {
                    key: 1621823998730,
                    parentKey: 1621823979640,
                    paramName: "param1",
                    required: false,
                    type: "string",
                    children: null
                },
                {
                    key: 1621824006108,
                    parentKey: 1621823979640,
                    paramName: "param2",
                    type: "number",
                    required: false,
                    children: null
                },
                {
                    key: 1621824014355,
                    parentKey: 1621823979640,
                    paramName: "param3",
                    type: "boolean",
                    required: false,
                    children: null
                },
                {
                    key: 1621824022495,
                    parentKey: 1621823979640,
                    paramName: "param4",
                    type: "array",
                    required: false,
                    children: [
                        {
                            key: 1621824034118,
                            parentKey: 1621824022495,
                            paramName: "item",
                            required: false,
                            type: "object",
                            children: [
                                {
                                    key: 1621824037230,
                                    parentKey: 1621824034118,
                                    paramName: "param1",
                                    required: false,
                                    type: "string",
                                    children: null
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 1622515732783,
                    parentKey: 1621823979640,
                    paramName: "param5",
                    type: "array",
                    required: true,
                    children: [
                        {
                            key: 1622515742797,
                            parentKey: 1622515732783,
                            paramName: "item",
                            required: false,
                            type: "string",
                            children: null
                        }
                    ]
                }
            ]
        }
    ],
    formParams: [ ],
    headerParams: [
        {
            key: 1622524790327,
            paramName: "Content-Type",
            required: true
        }
    ],
    flowchart: [
        {
            key: NumberInt("1"),
            type: "verify",
            base: true,
            advance: true
        },
        {
            key: 1621824097419,
            type: "handler",
            source: "export default function (context: IContext): IRespData | void {\n  // 在此处编写函数逻辑\n  context.$request.path\n}",
            comment: "这是函数备注\n哈哈",
            custom: true
        },
        {
            key: 1621824097418,
            type: "services",
            services: [
                {
                    key: 1621824097418,
                    name: "api1",
                    method: "post",
                    path: "/get/api1/:id",
                    pathParams: [
                        {
                            key: "id",
                            paramName: "id",
                            paramValue: "context.$request.query.param2",
                            valType: "expression"
                        }
                    ],
                    urlParams: [
                        {
                            key: 1622787843183,
                            paramName: "aaa",
                            paramValue: "123",
                            valType: "fixed"
                        },
                        {
                            key: 1622787850343,
                            paramName: "bbb",
                            paramValue: "context.$request.query.param1",
                            valType: "expression"
                        }
                    ],
                    bodyType: NumberInt("1"),
                    jsonSource: "export default function (context: IContext): IJson {\n  // 返回值需要能转换为JSON\n  return {\n    name: context.$request.body.abc,\n  };\n}",
                    formParams: [ ],
                    headerParams: [
                        {
                            key: 1622787926659,
                            paramName: "Content-Type",
                            valType: "fixed",
                            paramValue: "application/json"
                        }
                    ],
                    comment: ""
                }
            ]
        },
        {
            key: NumberInt("999"),
            type: "handler",
            source: "export default function (context: IContext): IRespData {\n  // 在此处编写函数逻辑\n  return {\n    code: 1,\n    data: {\n      time: new Date()\n    }\n  }\n}",
            comment: "",
            custom: false
        }
    ],
    createdTime: ISODate("2021-06-04T07:47:40.184Z"),
    name: "测试接口1",
    category: ObjectId("60b08fccb10366d879a6ac2d"),
    status: NumberInt("0"),
    method: "post",
    path: "/test1",
    description: "这是测试接口1的接口备注2",
    bodyType: NumberInt("1"),
    version: "1.0.11",
    versionMessage: "1",
    versionActive: true,
    versionThread: ObjectId("60a62dc6998a757a572df2dc"),
    createdBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for categories
// ----------------------------
db.getCollection("categories").drop();
db.createCollection("categories");

// ----------------------------
// Documents of categories
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("node-bff");
db.getCollection("categories").insert([ {
    _id: ObjectId("60b08fccb10366d879a6ac2d"),
    modifiedTime: ISODate("2021-05-29T04:26:49.251Z"),
    name: "222",
    description: "11111",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff046cd4b22fc1fc4dc7"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "111",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff116cd4b22fc1fc4dc8"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "333",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff146cd4b22fc1fc4dc9"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "444",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff176cd4b22fc1fc4dca"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "555",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff1a6cd4b22fc1fc4dcb"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "666",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff1d6cd4b22fc1fc4dcc"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "777",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff206cd4b22fc1fc4dcd"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "888",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff236cd4b22fc1fc4dce"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "999",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff2a6cd4b22fc1fc4dcf"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "101010",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
db.getCollection("categories").insert([ {
    _id: ObjectId("60b1ff2d6cd4b22fc1fc4dd0"),
    modifiedTime: ISODate("2021-05-29T08:00:11.489Z"),
    name: "111111",
    description: "",
    modifiedBy: "sunzhenghua",
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();
