describe('Asynchronous sandbox', () => {
  it('should wait for this promise to finish', () => {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => resolve(`I'm the promise result`), 1000);
    });

    p.then((result) => {
      // following will display "I'm the promise result" after 1s
      console.log(result);
    });
  });
});
