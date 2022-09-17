import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/index.html');

class Test extends StageTest {

    page = this.getPage(pagePath)


    tests = [this.node.execute(async () => {
        // set viewport
        await this.page.open()
        await this.page.setViewport({width: 815, height: 600})

        return correct()
    }),
        this.page.execute(() => {
            // test #1
            // # OF NODES
            // HELPERS-->
            this.notExist = (node, correctVal = "body", nodeName) => {
                const element = document.body.querySelector(node)
                if (!element) return true
                if(nodeName && element.nodeName.toLowerCase() !== nodeName) return true
                const parent = element.parentElement
                return parent.nodeName.toLowerCase() !== correctVal
            };
            this.innerTextExist = (node) => {
                const element = document.body.querySelector(node);
                return !element.innerText || element.innerText.trim().length === 0;
            };
            this.correctAttr = (attr, correctVal) => {
                return !attr || !attr.includes(correctVal)
            };
            this.correctStyle = (node, prop, correctVal) => {
                const element = document.querySelector(node);
                let style = getComputedStyle(element)[prop];
                if (style.includes("px") && !style.includes(" ")) {
                    style = Math.floor(style.split("px")[0]) + 1
                    correctVal = Math.floor(correctVal.split("px")[0]) + 1
                }
                return !style || style !== correctVal
            }
            this.bgColorExist = (node) => {
                const empty = "rgba(0, 0, 0, 0)";
                const element = document.querySelector(node);
                const style = getComputedStyle(element).backgroundColor;
                return !style || style.trim() === empty;
            }
            // <--HELPERS

            // check number of nodes in body
            let bodyNodes = Array.from(document.body.childNodes);
            this.innerBodyElements = bodyNodes.filter(
                e => e.nodeType === Node.ELEMENT_NODE);

            let len = this.innerBodyElements.length;
            const totalElements = 3;
            const errorMsg = `There should be ${totalElements} elements in the body of the HTML document, found: ${len}`;
            return len === totalElements ? correct() : wrong(errorMsg);

        }),
        this.page.execute(() => {
            // test #2
            // TAG EXIST

            // check if header exist
            let errorMsg = "The header tag is missing in the body of the HTML document.";
            if (this.notExist("header")) return wrong(errorMsg);

            // check if main exist
            errorMsg = "The main tag is missing in the body of the HTML document.";
            if (this.notExist("main")) return wrong(errorMsg);

            // check if footer exist
            errorMsg = "The footer tag is missing in the body of the HTML document.";
            if (this.notExist("footer")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #2.1
            // TAG ORDER

            const body = document.body.children;

            // check  header order 1st
            const header = body[0].tagName.toLowerCase();
            let errorMsg = "The header tag should be the first element in the body of the HTML document.";
            if (header !== "header") return wrong(errorMsg);

            // check main order 2nd
            const main = body[1].tagName.toLowerCase();
            errorMsg = "The main tag should be the second element in the body of the HTML document.";
            if (main !== "main") return wrong(errorMsg);

            // check if footer exist
            const footer = body[2].tagName.toLowerCase();
            errorMsg = "The footer tag should be the third element in the body of the HTML document.";
            if (footer !== "footer") return wrong(errorMsg);

            return correct()
        }),
        // test #3 removed
        // test #4 removed
        this.page.execute(() => {
            // test #5
            // HEIGHT

            // check if body has max-height
            let errorMsg = "The body tag doesn't have the correct max-height value.";
            if (this.correctStyle("body", "maxHeight", "600px")) return wrong(errorMsg)

            // check if header has min-height
            errorMsg = "The header tag doesn't have the correct min-height value.";
            if (this.correctStyle("header", "minHeight", "60px")) return wrong(errorMsg)

            // check if main has min-height
            errorMsg = "The main tag doesn't have the correct min-height value.";
            if (this.correctStyle("main", "minHeight", "360px")) return wrong(errorMsg)

            // check if footer has min-height
            errorMsg = "The footer tag doesn't have the correct min-height value.";
            if (this.correctStyle("footer", "minHeight", "180px")) return wrong(errorMsg)

            return correct()

        }),
        // test #6 removed
        // test #7 removed
    ]

}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);