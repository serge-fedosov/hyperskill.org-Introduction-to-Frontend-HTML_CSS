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
            this.notExist = (node, parentNode = "body", nodeName) => {
                const element = document.body.querySelector(node)
                if (!element) return true
                if (nodeName && element.nodeName.toLowerCase() !== nodeName) return true
                const parent = element.parentElement
                return parent.nodeName.toLowerCase() !== parentNode
            };
            this.innerTextExist = (node, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                if (correctVal) return !element.innerText.trim().includes(correctVal)
                return !element.innerText || element.innerText.trim().length === 0;
            };
            this.correctAttr = (node, attr, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                if (!element) return true
                const _attr = element.getAttribute(attr)
                return !_attr || !_attr.includes(correctVal)
            };
            this.correctStyle = (node, prop, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                let style = getComputedStyle(element)[prop];
                if (style.includes("px") && !style.includes(" ")) {
                    style = Math.floor(style.split("px")[0]) + 1
                    correctVal = Math.floor(correctVal.split("px")[0]) + 1
                }
                return !style || style !== correctVal
            };
            this.correctStyleIn = (node, prop, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                let style = getComputedStyle(element)[prop];
                return !style || !style.includes(correctVal)
            };
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
        this.page.execute(() => {
            // test #8
            // NAV

            // check if nav exist
            let errorMsg = "The nav tag is missing inside the header tag.";
            if (this.notExist("nav", "header")) return wrong(errorMsg);

            // CONTAINER STYLE

            // check if nav has max-width style
            errorMsg = "The nav tag doesn't have the correct max-width value.";
            if (this.correctStyle("nav", "maxWidth", "100%")) return wrong(errorMsg)

            return correct()

        }),
        this.page.execute(() => {
            // test #9
            // NAV FLEX

            // check if nav has flex style
            let errorMsg = "The nav tag doesn't have the correct display value.";
            if (this.correctStyle("nav", "display", "flex")) return wrong(errorMsg)

            // check if nav has flex wrap style
            errorMsg = "The nav tag doesn't have the correct flex-wrap value.";
            if (this.correctStyle("nav", "flexWrap", "wrap")) return wrong(errorMsg)

            return correct()

        }),
        // test #10 removed
        this.page.execute(() => {
            // test #11
            // LINKS EXIST

            // LINK_LOGO
            // check if link logo exist
            let errorMsg = "The anchor tag with the id of 'link_logo' is missing inside the nav tag.";
            if (this.notExist("#link_logo", "nav", "a")) return wrong(errorMsg);

            // LINK_HOME
            // check if link home exist
            errorMsg = "The anchor tag with the id of 'link_home' is missing inside the nav tag.";
            if (this.notExist("#link_home", "nav", "a")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if link product exist
            errorMsg = "The anchor tag with the id of 'link_product' is missing inside the nav tag.";
            if (this.notExist("#link_product", "nav", "a")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if link contact exist
            errorMsg = "The anchor tag with the id of 'link_contact' is missing inside the nav tag.";
            if (this.notExist("#link_contact", "nav", "a")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #12
            // LINKS HREF

            // LINK_LOGO
            // check if link logo href correct
            let errorMsg = "The anchor tag with the id of 'link_logo' is missing the correct href attribute.";
            if (this.correctAttr("#link_logo", "href", "#home")) return wrong(errorMsg);

            // LINK_HOME
            // check if link home href correct
            errorMsg = "The anchor tag with the id of 'link_home' is missing the correct href attribute.";
            if (this.correctAttr("#link_home", "href", "#home")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if link product href correct
            errorMsg = "The anchor tag with the id of 'link_product' is missing the correct href attribute.";
            if (this.correctAttr("#link_product", "href", "#product")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if link contact href correct
            errorMsg = "The anchor tag with the id of 'link_contact' is missing the correct href attribute.";
            if (this.correctAttr("#link_contact", "href", "#contact")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #13
            // LINK IMG

            // check if img exist
            let errorMsg = "The image tag is missing inside the link tag with the id of 'link_logo'.";
            if (this.notExist("img", "a")) return wrong(errorMsg);

            // check if img has correct src
            errorMsg = "The image tag in '#link_logo' doesn't have an src attribute value.";
            if (this.correctAttr("img", "src", "")) return wrong(errorMsg);

            // check if img has correct width
            errorMsg = "The image tag in '#link_logo' doesn't have the correct width attribute value.";
            if (this.correctAttr("img", "width", "64")) return wrong(errorMsg);

            // check if img has correct height
            errorMsg = "The image tag in '#link_logo' doesn't have the correct height attribute value.";
            if (this.correctAttr("img", "height", "64")) return wrong(errorMsg);

            // check if img has correct title
            errorMsg = "The image tag in '#link_logo' doesn't have a title attribute value.";
            if (this.correctAttr("img", "title", "")) return wrong(errorMsg);

            // check if img has correct alt
            errorMsg = "The image tag in '#link_logo' doesn't have an alt attribute value.";
            if (this.correctAttr("img", "alt", "")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #14
            // LINKS INNER TEXT

            // LINK_HOME
            // check if link home inner-text correct
            let errorMsg = "The anchor tag with the id of 'link_home' doesn't have the correct inner-text.";
            if (this.innerTextExist("#link_home", "Home")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if link product inner-text correct
            errorMsg = "The anchor tag with the id of 'link_product' doesn't have the correct inner-text.";
            if (this.innerTextExist("#link_product", "Product")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if link contact inner-text correct
            errorMsg = "The anchor tag with the id of 'link_contact' doesn't have the correct inner-text.";
            if (this.innerTextExist("#link_contact", "Contact")) return wrong(errorMsg);

            return correct()
        }),
        // test #15 removed
        // test #16 removed
        this.page.execute(() => {
            // test #17
            // BANNER CONTENT EXIST

            // check if home div exist
            const homeDiv = document.body.querySelector("#home");
            let errorMsg = "The div tag with the id of 'home' is missing inside the main tag.";
            if (this.notExist("#home", "main", "div")) return wrong(errorMsg);

            // check if second div exist
            const secDiv = homeDiv.querySelector("div");
            errorMsg = "The second div tag is missing inside the home div tag.";
            if (!secDiv) return wrong(errorMsg);

            // check if h1 exist
            const h1 = secDiv.querySelector("h1");
            errorMsg = "The h1 tag is missing inside the second div tag.";
            if (!h1) return wrong(errorMsg);

            // check if p exist
            const paragraph = secDiv.querySelector("h1 + p");
            errorMsg = "The paragraph tag is missing after the h1 tag inside the second div tag.";
            if (!paragraph) return wrong(errorMsg);

            // check if anchor exist
            const anchor = secDiv.querySelector("p + a");
            errorMsg = "The anchor tag is missing after the paragraph tag inside the second div tag.";
            if (!anchor) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #18
            // CONTENT INNER TEXT

            // check if h1 has inner text
            const homeDiv = document.querySelector("#home");
            const secDiv = homeDiv.querySelector("div");
            let errorMsg = "The h1 tag doesn't have an inner-text.";
            if (this.innerTextExist("h1")) return wrong(errorMsg);

            errorMsg = "The paragraph tag doesn't have an inner-text.";
            if (this.innerTextExist("p")) return wrong(errorMsg);

            const anchor = secDiv.querySelector("a");
            errorMsg = "The anchor tag doesn't have an inner-text.";
            if (this.innerTextExist(anchor)) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #19
            // HOME DIV STYLE

            // check if it has overflow hidden
            let errorMsg = "The div tag with the id of 'home' doesn't have the correct overflow value.";
            if (this.correctStyle("#home", "overflow", "hidden")) return wrong(errorMsg);

            // check if it has text center
            errorMsg = "The div tag with the id of 'home' doesn't have the correct text-align value.";
            if (this.correctStyle("#home", "text-align", "center")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #20
            // P STYLE

            const homeDiv = document.querySelector("#home");
            const secDiv = homeDiv.querySelector("div");
            const paragraph = secDiv.querySelector("p");

            // check if it has font size
            let errorMsg = "The paragraph tag doesn't have the correct font size value.";
            if (this.correctStyle(paragraph, "font-size", "20px")) return wrong(errorMsg);

            // check if it has font weight
            errorMsg = "The paragraph tag doesn't have the correct font weight value.";
            if (this.correctStyle(paragraph, "font-weight", "300")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #21
            // ANCHOR  STYLE

            // check if it has href
            const homeDiv = document.querySelector("#home");
            const secDiv = homeDiv.querySelector("div");
            const anchor = secDiv.querySelector("a");
            let errorMsg = "The anchor tag doesn't have the correct href attribute value.";
            if (this.correctAttr(anchor, "href", "#product")) return wrong(errorMsg);

            // check if it has display inline-block
            errorMsg = "The anchor tag doesn't have the correct display value.";
            if (this.correctStyle(anchor, "display", "inline-block")) return wrong(errorMsg);

            // check if it has correct border
            errorMsg = "The anchor tag doesn't have the correct border value.";
            if (this.correctStyleIn(anchor, "border", "1px solid")) return wrong(errorMsg);

            // check if it has padding-top
            errorMsg = "The anchor tag doesn't have the correct padding-top value.";
            if (this.correctStyle(anchor, "padding-top", "6px")) return wrong(errorMsg);

            // check if it has padding-bottom
            errorMsg = "The anchor tag doesn't have the correct padding-bottom value.";
            if (this.correctStyle(anchor, "padding-bottom", "6px")) return wrong(errorMsg);

            // check if it has padding-right
            errorMsg = "The anchor tag doesn't have the correct padding-right value.";
            if (this.correctStyle(anchor, "padding-right", "12px")) return wrong(errorMsg);

            // check if it has padding-left
            errorMsg = "The anchor tag doesn't have the correct padding-left value.";
            if (this.correctStyle(anchor, "padding-left", "12px")) return wrong(errorMsg);

            // check if it has font size
            errorMsg = "The anchor tag doesn't have the correct font size value.";
            if (this.correctStyle(anchor, "font-size", "16px")) return wrong(errorMsg);

            // check if it has font size
            errorMsg = "The anchor tag doesn't have the correct border radius value.";
            if (this.correctStyle(anchor, "border-radius", "4px")) return wrong(errorMsg);

            // check if it has text decoration
            errorMsg = "The anchor tag doesn't have the correct text decoration value.";
            if (this.correctStyle(anchor, "text-decoration-line", "none")) return wrong(errorMsg);

            return correct()

        })]

}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);