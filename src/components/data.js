import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "高光功能",
  desc: "跨境电商ERP系统通过自动化的运营功能，全面替代繁琐的日常手动操作。不仅提高了工作效率，还确保了运营流程的精准和高效，让您的电商管理变得更加轻松和智能。",
  image: benefitOneImg,
  bullets: [
    {
      title: "自动上新",
      desc: "根据选品规则，设置好时间，系统自动采集发布新品，无需手动操作.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "优惠设置",
      desc: "结合平台优惠逻辑以及自定义优惠策略，确保最佳促销效果",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "活动报名",
      desc: "追踪电商平台的优惠信息，自动报名电商平台活动，提升店铺曝光率",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "精准、高效、灵活",
  desc: "跨境电商ERP系统通过人工智能操作，避免人为错误，实现数据和流程的高精度管理。智能学习功能根据历史数据自动优化操作，提供个性化的服务和营销策略。系统还支持多终端操作，包括PC端、移动端和语音操控，让您不被地点和环境限制，随时随地高效管理电商运营。确保了业务运营的持续优化和增长。",
  image: benefitTwoImg,
  bullets: [
    {
      title: "持续优化",
      desc: "系统根据历史数据自动优化操作流程",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "精准操作",
      desc: "系统通过人工智能操作，避免人为错误，实现数据和流程的高精度管理。",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "灵活可控",
      desc: "支持PC端、移动端和语音操控，随时随地管理电商运营。 ",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
