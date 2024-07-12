import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

import { benefitOne, benefitTwo } from "@/components/data";
export default function Home() {
  return (
    <Container>
      <Hero />
      <SectionTitle
        preTitle="真正的 AI ERP"
        title=" AI ERP 同人类一样工作的 ERP"
      >
        跨境电商ERP系统通过强大的AI引擎，全面提升电商运营效率。
        系统能够自动执行定时上新、优惠设置、活动报名等常规运营任务，帮助企业节省大量人力成本。
        同时，智能学习功能持续优化系统操作，提供更加个性化和高效的服务。
        此外，系统还能根据客户行为数据进行个性化推荐和精准营销，大幅提升客户转化率和忠诚度。
        多终端支持和自然语言操作让系统易于使用，适合各类用户。
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="观看视频"
        title="观看演示视频"
      >
        即将到来，敬请期待！
      </SectionTitle>

      <Video videoId="fZ0D0cnR88E" />

      <SectionTitle
        preTitle="Testimonials"
        title="我们的系统可以做到"
      >
        效果展示部分汇集了使用我们跨境电商ERP系统后客户取得的显著成果。通过详细的数据和具体的案例，我们向您展示系统在提升销售额、降低成本和确保数据安全方面的实际效果。
        这里的成功案例和统计数据将帮助您更好地理解系统如何为您的业务带来实实在在的价值，助您实现更高的投资回报和运营效率。
      </SectionTitle>

      <Testimonials />

      <SectionTitle preTitle="FAQ" title="常见问题">
        为了帮助您更好地了解和使用我们的跨境电商ERP系统，我们准备了常见问题解答（FAQ）部分。
        这里汇集了用户在使用过程中经常遇到的问题及其解决方案。
      </SectionTitle>

      <Faq />
      <Cta />
    </Container>
  );
}
