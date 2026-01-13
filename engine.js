(async () => {
  window.cleanup = async () => {
    if (!old_v_page) old_v_page = window.location.pathname;
    common_css();
    specific_css();
    await unique_html();
    await common_html();
    await every_js();
    await common_js();
    await specific_js();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const ref = await import("./reference.js").then((module) => module.ref);
  const frag = document.createRange();
  const body = document.body;
  const CACHE_NAME = "Fragmenium";
  const VERSION_KEY = new Request("/fragment-version");
  const cacheNames = await caches.keys();

  if (cacheNames.includes(CACHE_NAME)) {
    const cache = await caches.open(CACHE_NAME);
    const CacheVersionRes = await cache.match(VERSION_KEY);
    const currentCacheVersion = CacheVersionRes
      ? await CacheVersionRes.text()
      : false;
    if (ref.version === "dev") {
      console.log("what");
      await caches.delete(CACHE_NAME);
    } else if (ref.version !== currentCacheVersion) {
      await caches.delete(CACHE_NAME);
      const newCache = await caches.open(CACHE_NAME);
      await newCache.put(
        VERSION_KEY,
        new Response(ref.version, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      );
    }
  } else if (ref.version !== "dev") {
    const newCache = await caches.open(CACHE_NAME);
    await newCache.put(
      VERSION_KEY,
      new Response(ref.version, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
  if (ref.swap) {
    swaps(body);
  }
  constant_css();
  common_css();
  specific_css();
  await constant_html();
  await common_html();
  await constant_js();
  await every_js();
  await common_js();
  await specific_js();
  old_v_page = window.location.pathname;
  window.addEventListener("popstate", cleanup);

  body.addEventListener("click", async (e) => {
    const a = e.target.tagName === "A" ? e.target : e.target.closest("a");
    if (!a || a.hasAttribute("target")) return;
    const proto = new URL(a.href).protocol;
    if (proto !== "https:" && proto !== "http:") return;
    e.preventDefault();
    history.pushState({}, "", a.href);
    await cleanup();
  });

  function constant_css() {
    if (ref?.css?.constant) {
      ref.css.constant.forEach((path) => {
        css_apply(path, "constant");
      });
    }
  }
  function common_css() {
    if (!ref?.css?.common) return;
    const path = new Path(window.location.pathname);
    let dir = path.directory_path();
    if (dir === "") dir = "/";
    const matched = ref.css.common[dir];
    if (window.active_dir === dir) return;
    document.head
      .querySelectorAll('link[data-type="common"]')
      .forEach((l) => l.remove());
    window.active_dir = dir;
    if (matched) matched.forEach((u) => css_apply(u, "common"));
  }
  function specific_css() {
    if (!ref?.css?.specific) return;
    document.head
      .querySelectorAll('link[data-type="specific"]')
      .forEach((l) => l.remove());
    const matchedCSS = ref.css.specific[window.location.pathname];
    if (!matchedCSS) return;
    matchedCSS.forEach((u) => css_apply(u, "specific"));
  }
  function css_apply(path, type) {
    document.head.appendChild(
      frag.createContextualFragment(
        `<link data-type="${type}" rel="stylesheet" href="${path}">`
      )
    );
  }
  async function unique_html(e) {
    if (ref.unique) {
      const pathname = window.location.pathname;
      const res = await fetch(pathname);
      if (!res.ok) {
        const path = ref.error_page ? ref.error_page : `/404.html`;
        history.replaceState({}, "", path);
        unique_html();
        return;
      }
      const text = await res.text();
      const dom = await frag.createContextualFragment(text);

      const tasks = ref.unique.map(async (selector) => {
        const ele = document.querySelector(selector);
        const new_ele = dom.querySelector(selector);
        await swaps(new_ele);
        if (ele) {
          if (new_ele) {
            ele.replaceWith(new_ele);
          } else {
            console.log(`"${selector}" does not exist in ${pathname}`);
          }
        } else {
          console.log(`"${selector}" does not exist in ${old_v_page}`);
        }
      });

      await Promise.all(tasks);
    }
  }
  async function common_html() {
    if (ref.common) {
      const pathname = window.location.pathname;
      let path = new Path(pathname);
      let directory = path.directory_path();
      if (directory === "") {
        directory = "/";
      }
      const tasks = ref.common.map(async (entry) => {
        let path;
        if (entry.except) {
          path = entry.except[directory];
        }
        if (path) {
          if (window[entry.selector] == directory) return;
          window[entry.selector] = directory;
        } else {
          if (window[entry.selector] == "default") return;
          window[entry.selector] = "default";
          path = entry.default;
        }
        const ele = body.querySelector(entry.selector);
        if (ele) {
          try {
            const text = await fetch_text(path);
            const common_dom = frag.createContextualFragment(text);
            const common_ele = common_dom.querySelector(entry.selector);
            await swaps(common_ele);
            ele.replaceWith(common_ele);
          } catch (err) {
            console.error(`Error fetching or injecting ${entry.path}:`, err);
          }
        } else {
          console.log(`"${entry.selector}" does not exist on this page`);
        }
      });

      await Promise.all(tasks);
    }
  }
  async function common_js() {
    if (!ref?.js?.common) return;
    iframe_remover("#common_js");
    const path = new Path(window.location.pathname);
    let directory = path.directory_path();
    if (directory == "") directory = "/";
    const matchedJS = ref.js.common[directory];
    if (matchedJS) {
      await js(ref.js.common[directory], "common_js");
    }
  }
  async function specific_js() {
    if (!ref?.js?.specific) return;
    iframe_remover("#specific_js");
    const pathname = window.location.pathname;
    const matchedJS = ref.js.specific[pathname];
    if (matchedJS) {
      await js(matchedJS, "specific_js");
    }
  }
  async function every_js() {
    if (ref?.js?.every) {
      iframe_remover("#every_js");
      await js(ref.js.every, "every_js");
    }
  }
  async function constant_js() {
    if (ref?.js?.constant) {
      iframe_remover("#constant_js");
      await js(ref?.js?.constant);
    }
  }
  async function constant_html() {
    if (ref.constant) {
      const constant_task = ref.constant.map(async (constant) => {
        const pathname = window.location.pathname;
        let text;
        if (constant.except?.[pathname]) {
          text = await fetch_text(constant.except[pathname]);
        } else {
          text = await fetch_text(constant.path);
        }
        const constant_frag = await frag.createContextualFragment(text);
        const constant_ele = constant_frag.querySelector(constant.selector);
        if (!constant_ele) {
          console.error(
            `Constant selector "${constant.selector}" is missing in constant path "${constant.path}"`
          );
          return;
        }
        await swaps(constant_ele);
        const ele = body.querySelector(constant.selector);
        if (ele) {
          ele.replaceWith(constant_ele);
        } else {
          alert(`<${constant.selector}> element not find!`);
        }
      });
      await Promise.all(constant_task);
    }
  }
  async function swaps(context) {
    if (!ref.swap) return;
    const tasks = Object.entries(ref.swap).map(async ([selector, path]) => {
      const instans = context.querySelectorAll(selector);
      for (const instan of instans) {
        if (instan) {
          let swap;
          if (window[`swap_text_` + path]) {
            swap = window[`swap_text_` + path];
          } else {
            swap = await fetch_text(path);
            window[`swap_text_` + path] = swap;
          }
          const params = swap.match(/\${(.*?)}/g);
          if (params) {
            for (let param of params) {
              const value =
                instan.getAttribute(param.match(/\$\{([^}]+)\}/)?.[1]) ?? "";
              swap = swap.replace(param, value);
            }
          }
          const swap_frag = frag.createContextualFragment(swap);
          instan.replaceWith(swap_frag);
        }
      }
    });
    await Promise.all(tasks);
  }
  async function fetch_text(path) {
    const cache = await caches.open(CACHE_NAME);
    const CacheVersionRes = await cache.match(VERSION_KEY);
    const currentCacheVersion = CacheVersionRes
      ? await CacheVersionRes.text()
      : false;
    if (ref.version === "dev") {
      const res = await fetch(path);
      if (!res.ok) console.warn(res.status);
      return await res.text();
    } else if (ref.version === currentCacheVersion) {
      const cachedRes = await cache.match(path);
      if (cachedRes) {
        return await cachedRes.text();
      }
      const res = await fetch(path);
      if (!res.ok) console.warn(res.status);
      await cache.put(path, res.clone());
      return await res.text();
    }
    const res = await fetch(path);
    if (!res.ok) {
      console.warn(res.status);
      return;
    }
    await cache.put(path, res.clone());
    return await res.text();
  }

  function iframe_remover(selector) {
    document.querySelector(selector)?.remove();
  }
  function Path(path) {
    this.path = path;
    this.extention = () => {
      return this.path.split(".").pop();
    };
    this.file = () => {
      return this.path.split("/").pop();
    };
    this.directory_path = () => {
      const dir_path = this.path.split("/");
      dir_path.pop();
      return dir_path.join("/");
    };
    this.directorys = () => {
      const dir_path = this.path.split("/");
      dir_path.shift();
      dir_path.pop();
      return dir_path;
    };
  }
  async function js(context, id) {
    const scripts = await Promise.all(
      context.map(async (path) => {
        const txt = await fetch_text(path);
        return `\n //start ${path}\n${txt}\n//end ${path}\n`;
      })
    );
    insert(scripts);
    if (id === "every_js") window.js_every_EXECUUTE = scripts;
    function insert(list) {
      const code = `(async()=>{ with(top.window){ ${list.join("\n")} } })();`;
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.id = id;
      body.appendChild(iframe);
      iframe.contentDocument.body.appendChild(
        iframe.contentDocument
          .createRange()
          .createContextualFragment(`<script>${code}<\/script>`)
      );
    }
  }
})();