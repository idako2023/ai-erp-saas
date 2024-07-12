import React from "react";
import Link from 'next/link';
import { Container } from "@/components/Container";

export const Cta = () => {
  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-5 mx-auto text-white bg-indigo-600 px-7 py-7 lg:px-12 lg:py-12 lg:flex-nowrap rounded-xl">
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-2xl font-medium lg:text-3xl">
            想要使用我们的产品吗？
          </h2>
          <p className="mt-2 font-medium text-white text-opacity-90 lg:text-xl">
            立即加入我们的waitlist，审核通过后，我们会将账户密码发送到您的邮箱！
          </p>
        </div>
        <div className="flex-shrink-0 w-full text-center lg:w-auto">
          <Link href="/waitlist" passHref legacyBehavior>
            <a
              className="inline-block py-3 mx-auto text-lg font-medium text-center text-indigo-600 bg-white rounded-md px-7 lg:px-10 lg:py-5"
            >
              Join waitlist
            </a>
          </Link>
        </div>
      </div>
    </Container>
  );
};
