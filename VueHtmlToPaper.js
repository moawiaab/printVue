function addStyles(win, styles) {
    styles.forEach((style) => {
      let link = win.document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", style);
      win.document.getElementsByTagName("head")[0].appendChild(link);
    });
  }
  
  const VueHtmlToPaper = {
    install(app, options = {}) {
      app.config.globalProperties.$htmlToPaper = (
        el,
        localOptions,
        cb = () => true
      ) => {
        let defaultName = '_blank', 
        defaultSpecs = ['fullscreen=yes','titlebar=yes', 'scrollbars=yes'],
        defaultReplace = true,
        defaultStyles = [];
      let {
        name = defaultName,
        specs = defaultSpecs,
        replace = defaultReplace,
        styles = defaultStyles,
      } = options;
  
        // If has localOptions
        // TODO: improve logic
        if (!!localOptions) {
            if (localOptions.name) name = localOptions.name;
            if (localOptions.specs) specs = localOptions.specs;
            if (localOptions.replace) replace = localOptions.replace;
            if (localOptions.styles) styles = localOptions.styles;
          }
        const element = window.document.getElementById(el);
  
        if (!element) {
          alert(`Element to print #${el} not found!`);
          return;
        }
  
        var ifprint = document.createElement("iframe");
        document.body.appendChild(ifprint);
        ifprint.setAttribute("style","height:100%;width:0;");

        const win = ifprint.contentWindow;
  
        win.document.write(`
          <html>
            <head>
              <title>${window.document.title}</title>
            </head>
            <body style="margin:0">
              ${element.innerHTML}
            </body>
          </html>
        `);
  
        addStyles(win, styles);
        
  
        setTimeout(() => {
          win.document.close();
          win.focus();
          win.print();
          win.close();
          document.body.removeChild(ifprint);
          cb();
        }, 1);
  
        return true;
      };
    }
  };
  
  export default VueHtmlToPaper;
