import Footer from './Footer.js'
import Form from "./Form.js";
import Loading from "./Loading.js";
import Navbar from "./Navbar.js";
import Preview from "./Preview.js";
import SVG from "./SVG.js";
export default Vue.component("App", {
  components: { Footer, Form, Loading, Navbar, Preview, SVG},
  data: function () {
    return {
    };
  },
  created: function () {
  },
  methods: {
  },
  template: `
  <main id="app">
    <Loading />
    <div class="container py-4">
      <Navbar />
      <Form />
      <Svg />
      <Preview />
      <Footer />
    </div>
  </main>
  `
});