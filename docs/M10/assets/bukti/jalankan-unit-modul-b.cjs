const path=require('path');
const config=require('./jest-modul-b.config.cjs');
require(path.join(config.rootDir,'src/node_modules/jest')).runCLI({config:JSON.stringify(config),runInBand:true},[config.rootDir]).then(({results})=>{process.exitCode=results.success?0:1;}).catch(e=>{console.error(e);process.exitCode=1;});
