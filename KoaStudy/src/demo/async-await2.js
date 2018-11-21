// 模拟从后台请求数据，等数据回来再执行
function takeLongTime() {
  return new Promise(resolve => {
    setTimeout(() => resolve('long-time-value'), 1000);
  });
}

async function test() {
  // Promise { <pending> }
  // const v1 = takeLongTime();

  // long-time-value
  const v1 = await takeLongTime();
  console.log(v1);
}

test();

