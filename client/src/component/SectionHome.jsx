import React from "react";
import "./style/SectionHome.css";

const SectionHome = () => {
  return (
    <section class="section-home-policy">
      <div class="container">
        <div class="list-policy-row row">
          <div class="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
            <div class="policy-item__inner">
              <div class="policy-item__icon">
                <div class="icon">
                  <img
                    class=" lazyloaded"
                    data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_1.png?v=1028"
                    src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_1.png?v=1028"
                    alt="Miễn phí vận chuyển"
                  />
                </div>
              </div>
              <div class="policy-item__info">
                <h3 class="info-title">Miễn phí vận chuyển</h3>
                <div class="infor-des">Áp dụng cho mọi đơn hàng từ 500k</div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
            <div class="policy-item__inner">
              <div class="policy-item__icon">
                <div class="icon">
                  <img
                    class=" lazyloaded"
                    data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_2.png?v=1028"
                    src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_2.png?v=1028"
                    alt="Đổi hàng dễ dàng"
                  />
                </div>
              </div>
              <div class="policy-item__info">
                <h3 class="info-title">Đổi hàng dễ dàng</h3>
                <div class="infor-des">7 ngày đổi hàng vì bất kì lí do gì </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
            <div class="policy-item__inner">
              <div class="policy-item__icon">
                <div class="icon">
                  <img
                    class=" lazyloaded"
                    data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_3.png?v=1028"
                    src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_3.png?v=1028"
                    alt="Hỗ trợ nhanh chóng"
                  />
                </div>
              </div>
              <div class="policy-item__info">
                <h3 class="info-title">Hỗ trợ nhanh chóng</h3>
                <div class="infor-des">HOTLINE 24/7 : 0964942121</div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
            <div class="policy-item__inner">
              <div class="policy-item__icon">
                <div class="icon">
                  <img
                    class=" lazyloaded"
                    data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_4.png?v=1028"
                    src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_4.png?v=1028"
                    alt="Thanh toán đa dạng"
                  />
                </div>
              </div>
              <div class="policy-item__info">
                <h3 class="info-title">Thanh toán đa dạng</h3>
                <div class="infor-des">
                  Thanh toán khi nhận hàng, Napas, Visa, Chuyển Khoản{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionHome;
