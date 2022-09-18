const path = require('path');
const pagePath = 'file://' + path.resolve(__dirname, '../src/index.html');
const {StageTest, correct, wrong} = require('hs-test-web');

class FlashcardsTest extends StageTest {

    page = this.getPage(pagePath)

    tests = [
        this.page.execute(() => {
            let h1 = document.body.getElementsByTagName("h1");

            if (h1.length === 0) return wrong("There should be h1 element on the page");
            if (h1.length > 1) return wrong("There should be only one h1 element on the page.")
            if (!h1[0].innerText) return wrong("The h1 element should contain text.")

            return correct()
        }),
        this.page.execute(() => {
            let divs = document.body.getElementsByTagName("div");
            let k = 0;
            for (let div of divs) {
                if ((div.children.length === 1 && div.children[0].tagName.toLowerCase() === 'p') && div.innerText)
                    k++;
            }

            return k === 9 ? correct() : wrong("There should be 9 div elements with text inside 'p' element.");
        })
    ]

}


it('Test stage', async function () {
    try {
        this.timeout(30000)
    } catch (ignored) {
    }
    await new FlashcardsTest().runTests()
}, 30000)
