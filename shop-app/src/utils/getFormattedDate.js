export function getISODate(date) {
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  console.log(offset);
  // -540분 나오는데 이걸 60000곱해서 밀리세컨드로 만들고 new Date에서 빼준것
  const dateSplitArr = new Date(date - offset).toISOString().split("T");
  const yyyyMMdd = dateSplitArr[0];
  const hhmmss = dateSplitArr[1].split(".")[0];
  return { yyyyMMdd, hhmmss };
}
