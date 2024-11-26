(self.webpackChunk_kne_components_react_file=self.webpackChunk_kne_components_react_file||[]).push([[414],{25764:e=>{function n(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}n.keys=()=>[],n.resolve=n,n.id=25764,e.exports=n},69666:(e,n,a)=>{"use strict";a.d(n,{A:()=>l});var t=a(63181),o=(a(72241),a(13050)),r=a(55199);const l={name:"react-file",summary:'<h1>react-file</h1>\n<h3>\u63cf\u8ff0</h3>\n<p>\u63d0\u4f9b\u4e86\u6587\u4ef6\u4e0a\u4f20\uff0c\u6587\u4ef6\u9884\u89c8\uff0c\u6587\u4ef6\u6279\u91cf\u7ba1\u7406\u7b49\u529f\u80fd</p>\n<h3>\u5b89\u88c5</h3>\n<pre><code class="language-shell">npm i --save @kne/react-file\n</code></pre>',description:"\u63d0\u4f9b\u4e86\u6587\u4ef6\u4e0a\u4f20\uff0c\u6587\u4ef6\u9884\u89c8\uff0c\u6587\u4ef6\u6279\u91cf\u7ba1\u7406\u7b49\u529f\u80fd",packageName:"@kne/react-file",api:"<table>\n<thead>\n<tr>\n<th>\u5c5e\u6027\u540d</th>\n<th>\u8bf4\u660e</th>\n<th>\u7c7b\u578b</th>\n<th>\u9ed8\u8ba4\u503c</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n</tr>\n</tbody>\n</table>",example:{isFull:!0,className:"react_file_b1237",style:"",list:[{title:"File",description:"\u4eceoss\u83b7\u53d6\u6587\u4ef6\u5730\u5740",code:"const { default: File } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\n\nconst BaseExample = createWithRemoteLoader({\n  modules: ['components-core:Global@PureGlobal']\n})(({ remoteModules }) => {\n  const [PureGlobal] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,\n        getUrl: {\n          loader: async ({ params }) => {\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve('/logo192.png');\n              }, 1000);\n            });\n          }\n        }\n      }\n    }\n  }}>\n    <File id=\"123\">{({ url }) => {\n      return url;\n    }}</File>\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n",scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]},{title:"Image",description:"\u663e\u793a\u56fe\u7247",code:'const { Image } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\nconst { Divider } = antd;\n\nconst BaseExample = createWithRemoteLoader({\n  modules: [\'components-core:Global@PureGlobal\', \'components-core:InfoPage\']\n})(({ remoteModules }) => {\n  const [PureGlobal, InfoPage] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath(\'react-file\') || window.PUBLIC_URL,\n        getUrl: {\n          loader: async ({ params }) => {\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve(\'/mock/avatar.png\');\n              }, 2000);\n            });\n          }\n        }\n      }\n    }\n  }}>\n    <InfoPage>\n      <InfoPage.Part title="\u56fe\u7247">\n        <Image src="xxxxxx" />\n        <Image id="xxxxxx" style={{ width: 200, height: 200 }} />\n      </InfoPage.Part>\n      <InfoPage.Part title="\u5934\u50cf">\n        <Image.Avatar gender="F" />\n        <Image.Avatar gender="M" />\n        <Image.Avatar />\n        <Image.Avatar gender="F" id="xxxxxx" />\n        <Divider />\n        <Image.Avatar gender="F" shape="square" />\n        <Image.Avatar gender="M" shape="square" />\n        <Image.Avatar shape="square" />\n        <Image.Avatar gender="F" id="xxxxxx" shape="square" />\n        <Divider />\n        <Image.Avatar gender="F" size={30} />\n        <Image.Avatar gender="M" size={50} />\n        <Image.Avatar size={80} />\n        <Image.Avatar gender="F" id="xxxxxx" size={100} />\n      </InfoPage.Part>\n    </InfoPage>\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n',scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"antd",packageName:"antd",component:r},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]},{title:"Download",description:"\u6587\u4ef6\u4e0b\u8f7d",code:'const { Download } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\nconst { Flex } = antd;\n\nconst BaseExample = createWithRemoteLoader({\n  modules: [\'components-core:Global@PureGlobal\']\n})(({ remoteModules }) => {\n  const [PureGlobal] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath(\'react-file\') || window.PUBLIC_URL,\n        getUrl: {\n          loader: async ({ params }) => {\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve(\'/logo192.png\');\n              }, 1000);\n            });\n          }\n        }\n      }\n    }\n  }}>\n    <Flex gap={8}>\n      <Download id="123">\u4e0b\u8f7d\u6587\u4ef6</Download>\n      <Download id="123" filename="\u56fe\u7247">\u4e0b\u8f7d\u6587\u4ef6\u5e76\u8bbe\u7f6e\u540d\u79f0</Download>\n      <Download src="/logo192.png" filename="\u56fe\u7247">\u76f4\u63a5\u901a\u8fc7src\u94fe\u63a5\u4e0b\u8f7d</Download>\n    </Flex>\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n',scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"antd",packageName:"antd",component:r},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]},{title:"FileButton",description:"\u9884\u89c8\u6587\u4ef6\u6309\u94ae",code:'const { FileButton } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\n\nconst BaseExample = createWithRemoteLoader({\n  modules: [\'components-core:Global@PureGlobal\']\n})(({ remoteModules }) => {\n  const [PureGlobal] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath(\'react-file\') || window.PUBLIC_URL,\n        getUrl: {\n          loader: async ({ params }) => {\n            const urlMap = {\n              1: \'/mock/resume.png\',\n              2: \'/mock/resume.pdf\',\n              3: \'/mock/resume.html\',\n              4: \'/mock/resume.txt\',\n              5: \'/mock/audio.wav\',\n              6: \'/mock/resume.docx\'\n            };\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve(urlMap[params.id]);\n              }, 1000);\n            });\n          }\n        }\n      }\n    }\n  }}>\n    <FileButton id="1" filename="demo.jpg" modalProps={{ width: 800 }}>\u9884\u89c8demo.jpg</FileButton>\n    <FileButton id="2" filename="demo2.pdf" modalProps={{ width: 800 }}>\u9884\u89c8demo2.pdf</FileButton>\n    <FileButton id="3" filename="demo2.html" modalProps={{ width: 800 }}>\u9884\u89c8demo2.html</FileButton>\n    <FileButton id="6" filename="resume.docx" modalProps={{ width: 800 }} type="link">resume.docx</FileButton>\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n',scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"antd",packageName:"antd",component:r},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]},{title:"FileList",description:"\u6587\u4ef6\u5217\u8868",code:"const { FileList } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\nconst { Divider } = antd;\n\nconst BaseExample = createWithRemoteLoader({\n  modules: ['components-core:Global@PureGlobal']\n})(({ remoteModules }) => {\n  const [PureGlobal] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,\n        getUrl: {\n          loader: async ({ params }) => {\n            const urlMap = {\n              1: '/mock/resume.png',\n              2: '/mock/resume.pdf',\n              3: '/mock/resume.html',\n              4: '/mock/resume.txt',\n              5: '/mock/audio.wav',\n              6: '/mock/resume.docx'\n            };\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve(urlMap[params.id]);\n              }, 1000);\n            });\n          }\n        }\n      }\n    }\n  }}>\n    <FileList dataSource={[{\n      uuid: '121233',\n      type: 'uploading',\n      filename: '\u5f20\u4e09\u7684\u7b80\u5386.doc'\n    },\n      {\n        id: '2',\n        filename: '\u6211\u662f\u4e00\u4efd\u7b80\u5386.pdf',\n        date: '2022-07-15T11:09:15.000+08:00',\n        userName: '\u7528\u6237\u540d'\n      }]} />\n    <Divider />\n    <FileList dataSource={[]} />\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n",scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"antd",packageName:"antd",component:r},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]},{title:"FileUpload",description:"\u6587\u4ef6\u4e0a\u4f20",code:"const { FileUpload } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\n\nconst urls = {};\n\nconst BaseExample = createWithRemoteLoader({\n  modules: ['components-core:Global@PureGlobal']\n})(({ remoteModules }) => {\n  const [PureGlobal] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,\n        getUrl: {\n          loader: async ({ params }) => {\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve(urls[params.id]);\n              }, 1000);\n            });\n          }\n        }, upload: ({ file }) => {\n          urls[file.name] = URL.createObjectURL(file);\n          return new Promise((resolve) => {\n            setTimeout(() => {\n              resolve({\n                data: {\n                  code: 0, data: {\n                    id: file.name, filename: file.name\n                  }\n                }\n              });\n            }, 1000);\n          });\n        }\n      }\n    }\n  }}>\n    <FileUpload />\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n",scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"antd",packageName:"antd",component:r},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]},{title:"FilePreview",description:"\u6587\u4ef6\u9884\u89c8",code:'const { FilePreview } = _ReactFile;\nconst { createWithRemoteLoader, getPublicPath } = remoteLoader;\n\nconst BaseExample = createWithRemoteLoader({\n  modules: [\'components-core:Global@PureGlobal\', \'components-core:InfoPage\']\n})(({ remoteModules }) => {\n  const [PureGlobal, InfoPage] = remoteModules;\n  return <PureGlobal preset={{\n    ajax: async api => {\n      return { data: { code: 0, data: api.loader() } };\n    }, apis: {\n      file: {\n        staticUrl: getPublicPath(\'react-file\') || window.PUBLIC_URL, getUrl: {\n          loader: async ({ params }) => {\n            const urlMap = {\n              1: \'/mock/resume.png\',\n              2: \'/mock/resume.pdf\',\n              3: \'/mock/resume.html\',\n              4: \'/mock/resume.txt\',\n              5: \'/mock/audio.wav\',\n              6: \'/mock/resume.docx\'\n            };\n            return new Promise(resolve => {\n              setTimeout(() => {\n                resolve(urlMap[params.id]);\n              }, 1000);\n            });\n          }\n        }\n      }\n    }\n  }}>\n    <InfoPage>\n      <InfoPage.Part title="\u9884\u89c8\u56fe\u7247">\n        <FilePreview id="1" />\n      </InfoPage.Part>\n      <InfoPage.Part title="\u9884\u89c8PDF">\n        <FilePreview id="2" />\n      </InfoPage.Part>\n      <InfoPage.Part title="\u9884\u89c8HTML">\n        <FilePreview id="3" />\n      </InfoPage.Part>\n      <InfoPage.Part title="\u9884\u89c8TXT">\n        <FilePreview id="4" />\n      </InfoPage.Part>\n      <InfoPage.Part title="\u9884\u89c8AUDIO">\n        <FilePreview id="5" />\n      </InfoPage.Part>\n      <InfoPage.Part title="\u9884\u89c8OFFICE">\n        <FilePreview id="6" />\n      </InfoPage.Part>\n    </InfoPage>\n\n  </PureGlobal>;\n});\n\nrender(<BaseExample />);\n\n',scope:[{name:"_ReactFile",packageName:"@kne/current-lib_react-file",importStatement:'import * as _ReactFile from "@kne/react-file"',component:t},{name:"antd",packageName:"antd",component:r},{name:"remoteLoader",packageName:"@kne/remote-loader",component:o}]}]}}},11448:(e,n,a)=>{"use strict";var t=a(94922),o=a.n(t),r=a(87558),l=a(55199),i=a(89946),m=a.n(i),c=a(13050),s=a(1488),d=a.n(s),p=a(89261);window.PUBLIC_URL="/react-file";const u={url:"https://uc.fatalent.cn",tpl:"{{url}}/packages/@kne-components/{{remote}}/{{version}}/build"},P={...u,remote:"components-core",defaultVersion:"0.2.65"};(0,c.preset)({remotes:{default:P,"components-core":P,"components-iconfont":{...u,remote:"components-iconfont",defaultVersion:"0.1.8"},"react-file":{...u,remote:"react-file",defaultVersion:"0.1.9"}}});const g=(()=>{const e=m().create({validateStatus:function(){return!0}});return n=>n.hasOwnProperty("loader")&&"function"===typeof n.loader?Promise.resolve(n.loader(d()(n,["loader"]))).then((e=>({data:{code:0,data:e}}))).catch((e=>(l.message.error(e.message||"\u8bf7\u6c42\u53d1\u751f\u9519\u8bef"),{data:{code:500,msg:e.message}}))):e(n)})();(0,r.preset)({ajax:g,loading:(0,p.jsx)(l.Spin,{delay:500,style:{position:"absolute",left:"50%",padding:"10px",transform:"translateX(-50%)"}}),error:null,empty:(0,p.jsx)(l.Empty,{}),transformResponse:e=>{const{data:n}=e;return e.data={code:0===n.code?200:n.code,msg:n.msg,results:n.data},e}});var f=a(65457),h=a(94679),k=a(14152),x=a.n(k),b=(a(91296),a(46446));const F=x().ExampleRoutes,v=e=>{let{preset:n,themeToken:a,...t}=e;return(0,p.jsx)(h.HashRouter,{children:(0,p.jsx)(F,{...t,paths:[{key:"components",path:"/",title:"\u9996\u9875"}],preset:n,themeToken:a,readme:b.default,pageProps:{menu:null}})})};f.createRoot(document.getElementById("root")).render((0,p.jsx)(o().StrictMode,{children:(0,p.jsx)(v,{preset:{ajax:g},themeToken:{colorPrimary:"#4F185A"}})}))},72241:()=>{}}]);
//# sourceMappingURL=414.43d43b7f.chunk.js.map