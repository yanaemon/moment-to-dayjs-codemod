# jscodeshift-moment2dayjs

## How to use

```
$ yarn install
$ yarn jscodeshift -t transform.ts --parser ts path/to/file
```

### Caution

This lib cannot detect and don't replace below case.
Please check whether there is no such a case.

#### destructive use

Because moment.js is mutable but dayjs is immutable.

ex.
```
for (const d = moment(); d.add(1, 'date'); d++) {
  console.log(d.toDate());
}
```


#### variable assign

ex.
```
const d = moment();
// error unless you use objectSupport plugin
console.log(d.add({ date: 1 }).toDate());
```

I recommend to use [ObjectSupport](https://day.js.org/docs/en/plugin/object-support) plugin

## Test
```
$ yarn jest
```
