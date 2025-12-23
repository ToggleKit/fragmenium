(async () => {
    window.cleanup = async ()=> {
        if (!old_v_page) old_v_page = window.location.pathname;
        common_css();
        specific_css();
        await unique_html();
        await constant_html();
        await common_html();
        await every_js();
        await common_js();
        await specific_js();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    const ref = await import('./reference.js').then((module) => module.ref);
    const frag = document.createRange();
    const body = document.body;
    let previous_common_scripts;
    if (ref.swap) {
        swaps(body);
    };
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
        if (e.target.tagName == "A" && !e.target.getAttribute("target") || e.target.closest("a:not([target])")) {
            e.preventDefault();
            if (e.target.hash || e.target.closest("a").hash) {
                const ele = e.target.hash ? document.querySelector(e.target.hash) : document.querySelector(e.target.closest("a").hash);
                if (!ele) return;
                history.replaceState(null, "", e.target.hash);
                ele.scrollIntoView({ behavior: 'smooth' })
            } else {
                let path = e.target.tagName == "A" ? e.target.href : e.target.closest("a:not([target])").href;
                history.pushState({}, "", path);
                await cleanup();
            }

        }
    });
    
    function constant_css() {
        if (ref?.css?.constant) {
            ref.css.constant.forEach(path => {
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
        document.head.querySelectorAll('link[data-type="common"]').forEach(l => l.remove());
        window.active_dir = dir;
        if (matched) matched.forEach(u => css_apply(u, 'common'));
    }
    function specific_css() {
        if (!ref?.css?.specifics) return;
        document.head.querySelectorAll('link[data-type="specific"]').forEach(l => l.remove());
        const matchedCSS = ref.css.specifics[window.location.pathname];
        if (!matchedCSS) return;
        matchedCSS.forEach(u => css_apply(u, "specific"));
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
            const text = await fetch_text(pathname);
            if (!text) {
                const path = ref.error_page ? ref.error_page : `/404.html`;
                history.replaceState({}, "", path);
                unique_html();
                return;
            }
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
                let path
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
                        const common_ele = common_dom.querySelector(entry.selector)
                        await swaps(common_ele);
                        ele.replaceWith(common_ele);

                    } catch (err) {
                        console.error(`Error fetching or injecting ${entry.path}:`, err);
                    }
                } else {
                    console.log(`"${entry.selector}" does not exist on this page`);
                }

            })

            await Promise.all(tasks);

        }
    }
    async function common_js() {
        if (!ref?.js?.common) return;
        const path = new Path(window.location.pathname);
        let directory = path.directory_path();
        if (directory == "") directory = "/";
        const matchedJS = ref.js.common[directory];
        if (window.active_js_dir && window.active_js_dir !== directory) {
            iframe_remover("#common_js");
        } else if (window.active_js_dir && window.active_js_dir == directory) {
            iframe_remover("#common_js");
            await js(ref.js.common[directory], "common_js", directory)
        } else if (matchedJS && window.active_js_dir !== directory) {
            window.active_js_dir = directory;
            await js(ref.js.common[directory], "common_js", directory)
        }
    }
    async function specific_js() {
        if (!ref?.js?.specific) return;
        iframe_remover("#specific_js");
        const pathname = window.location.pathname;
        const matchedJS = ref.js.specific[pathname];
        if (matchedJS) {
            await js(matchedJS, "specific_js")
        }
    }
    async function every_js() {
        if (ref?.js?.every) {
            iframe_remover('#every_js');
            await js(ref.js.every, "every_js")
        }
    }
    async function constant_js() {
        if (ref?.js?.constant) {
            for (const path of ref.js.constant) {
                try {
                    await import(path);
                } catch (err) {
                    console.log(`issue with: ${path}\n${err}`)
                }
            }
        }
    }
    async function constant_html() {
        if (ref.constant) {
            const constant_task = ref.constant.map(async constant => {
                const key = `constant_html_default_${constant.selector}`;
                const pathname = window.location.pathname;
                const default_constant = `default_constant_${constant.selector}_polluted`;
                let text;
                if (constant.except?.[pathname]) {
                    text = await fetch_text(constant.except[pathname]);
                    window[default_constant] = true;
                } else {
                    switch (window[default_constant]) {
                        case undefined:
                            window[default_constant] = false;
                            text = await fetch_text(constant.path);
                            window[key] = text;
                            break;
                        case true:
                            text = window[key];
                            if (!text) {
                                text = await fetch_text(constant.path);
                            }
                            break;
                        case false:
                            return;
                    }
                }
                const constant_frag = await frag.createContextualFragment(text);
                const constant_ele = constant_frag.querySelector(constant.selector);
                if (!constant_ele) {
                    console.error(`Constant selector "${constant.selector}" is missing in constant path "${constant.path}"`);
                    return;
                }
                await swaps(constant_ele);
                const ele = body.querySelector(constant.selector);
                if (ele) {
                    ele.replaceWith(constant_ele)
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
                        window[`swap_text_` + path] = swap
                    }
                    const params = swap.match(/\${(.*?)}/g);
                    if (params) {
                        for (let param of params) {
                            const value = instan.getAttribute(param.match(/\$\{([^}]+)\}/)?.[1]) ?? "";
                            swap = swap.replace(param, value);
                        }
                    }
                    const swap_frag = frag.createContextualFragment(swap);
                    instan.replaceWith(swap_frag);
                }
            }
        })
        await Promise.all(tasks);
    }
    async function fetch_text(path) {
        if (path !== "" && path !== " ") {
            const text = await fetch(path).then(res => res.text());
            if (text) {
                return text;
            } else {
                return false;
            }

        } else {
            console.log(`path is not valid in "referencs.js": ${path}`)
        }
    }
    function iframe_remover(selector) {
        document.querySelector(selector)?.remove();
    }
    function Path(path) {
        this.path = path;
        this.extention = () => {
            return this.path.split('.').pop()
        };
        this.file = () => {
            return this.path.split('/').pop();
        }
        this.directory_path = () => {
            const dir_path = this.path.split('/');
            dir_path.pop();
            return dir_path.join('/');
        }
        this.directorys = () => {
            const dir_path = this.path.split('/');
            dir_path.shift();
            dir_path.pop();
            return dir_path
        }
    }
    async function js(context, id, directory) {
        if (id === 'common_js') {
            if (directory === window.active_js_dir && previous_common_scripts) {
                return insert(previous_common_scripts);
            }
            window.active_js_dir = directory;
        }
        const scripts = await Promise.all(
            context.map(async path => {
                const txt = await fetch_text(path);
                return `\n //start ${path}\n${txt}\n//end ${path}\n`;
            })
        );

        if (id === 'common_js') previous_common_scripts = scripts;
        insert(scripts);
        function insert(list) {
            const code = `(async()=>{ with(top.window){ ${list.join('\n')} } })();`;
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.id = id;
            body.appendChild(iframe);
            iframe.contentDocument.body.appendChild(
                iframe.contentDocument.createRange()
                    .createContextualFragment(`<script>${code}<\/script>`)
            );
        }
    }
})()