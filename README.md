# moment-to-dayjs-codemod

A [jscodeshift](https://github.com/facebook/jscodeshift) tranformer for migrating [moment](https://github.com/moment/moment) to [dayjs](https://github.com/iamkun/dayjs).

## How to use

```
$ npm install -g jscodeshift
$ git clone https://github.com/yanaemon/moment-to-dayjs-codemod.git

$ jscodeshift -t transform.ts --parser tsx path/to/file.ts
```

## Supported dayjs plugins

- [x] [arraySupport](https://day.js.org/docs/en/plugin/array-support)
- [x] [isBetween](https://day.js.org/docs/en/plugin/is-between)
- [x] [isSameOrAfter](https://day.js.org/docs/en/plugin/is-same-or-after)
- [x] [isSameOrBefore](https://day.js.org/docs/en/plugin/is-same-or-before)
- [x] [isoWeek](https://day.js.org/docs/en/plugin/iso-week)
- [x] [minMax](https://day.js.org/docs/en/plugin/min-max)
- [x] [objectSupport](https://day.js.org/docs/en/plugin/object-support)
- [ ] [updateLocale](https://day.js.org/docs/en/plugin/update-locale)
- [x] [utc](https://day.js.org/docs/en/plugin/utc)
- [x] [weekday](https://day.js.org/docs/en/plugin/weekday)

## Warning

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
