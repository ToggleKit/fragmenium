export const ref = {
    unique:["#context","#content","title"],
    constant:[
        {
            selector: "aside",
            path: "/fragments/html/constant/aside.html"
        },
        {
            selector: "header",
            path: "/fragments/html/constant/header.html",
            // except:{
            //     "<pathname>": "<reference>",
            //     "<pathname>": "<reference> ",
            // }
        },
        {
            selector: "footer",
            path: "/fragments/html/constant/footer.html"
        }
    ],
    // common:[
    //     {
    //         selector: "aside",
    //         default: "/fragments/html/common/aside.html",
    //         // except:{
    //         //     "<dir path>": "<reference>",
    //         //     "<dir path>": "<reference>"
    //         // }
    //     }
    // ],
    swap:{
        ".logo": "/fragments/html/swaps/logo.html"
    },
    js:{
        every:["/fragments/framworks/toggleKit.js","/fragments/js/swipe.js"]
    },
    css:{
        constant:["/fragments/framworks/toggleKit.css"],
        // common:{
        //     "/" : ["/common.css"]
        // },
        // specifics:{
        //     "<dir name>" :["<reference>"]
        // }

    }
}