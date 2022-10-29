const { fromEvent, scan } = rxjs

fromEvent(document, 'click')
  .pipe(scan((count) => {
    console.log("count===", count);
    return count + 1
  }, 0))
  .subscribe((count) => console.log(`Clicked ${count} times`));