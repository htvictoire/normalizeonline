type T = (key: string) => string;

export default function Content({ t }: { t: T }) {
  return (
    <>
      <section id="s1" className="scroll-mt-24">
        <p>{t("s1.p1")}</p>
        <p>{t("s1.p2")}</p>
      </section>

      <section id="s2" className="scroll-mt-24">
        <p>{t("s2.p1")}</p>
        <p>{t("s2.p2")}</p>
        <ul>
          <li>{t("s2.li1")}</li>
          <li>{t("s2.li2")}</li>
          <li>{t("s2.li3")}</li>
        </ul>
      </section>

      <section id="s3" className="scroll-mt-24">
        <p>{t("s3.p1")}</p>
        <p>{t("s3.p2")}</p>
      </section>
    </>
  );
}
