import Section1 from "./components/Section1";
import Section10 from "./components/Section10";
import Section11 from "./components/Section11";
import Section12 from "./components/Section12";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
// import Section6 from "./components/Section6";
import Section7 from "./components/Section7";
import Section8 from "./components/Section8";
import Section9 from "./components/Section9";
// import styles from "./styles/home.module.css";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="bg-white">
      <Section1 />
      <Section2 />
      <Section4 />
      <Section3 />
      {/* <Section5 /> */}
      {/* <Section6 /> */}
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />
    </main>
  );
}
