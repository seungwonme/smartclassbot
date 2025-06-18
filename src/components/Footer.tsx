import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin } from 'lucide-react';
const Footer = () => {
  const footerSections = [{
    title: "플랫폼",
    links: [{
      name: "기능 소개",
      href: "#features"
    }, {
      name: "가격 정책",
      href: "#pricing"
    }, {
      name: "API 문서",
      href: "#api"
    }, {
      name: "통합 가이드",
      href: "#integration"
    }]
  }, {
    title: "솔루션",
    links: [{
      name: "브랜드 관리",
      href: "#brand"
    }, {
      name: "캠페인 관리",
      href: "#campaign"
    }, {
      name: "인플루언서 매칭",
      href: "#matching"
    }, {
      name: "성과 분석",
      href: "#analytics"
    }]
  }, {
    title: "지원",
    links: [{
      name: "고객센터",
      href: "#support"
    }, {
      name: "사용자 가이드",
      href: "#guide"
    }, {
      name: "FAQ",
      href: "#faq"
    }, {
      name: "기술지원",
      href: "#tech-support"
    }]
  }, {
    title: "회사",
    links: [{
      name: "회사 소개",
      href: "#about"
    }, {
      name: "채용 정보",
      href: "#careers"
    }, {
      name: "언론 보도",
      href: "#press"
    }, {
      name: "파트너십",
      href: "#partnership"
    }]
  }];
  return <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <div className="absolute top-2 left-2 w-6 h-6 bg-black rounded-full"></div>
                </div>
                <span className="text-2xl font-bold text-foreground">circlue</span>
              </div>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">AI-powerd Brand &amp; Influencer matching Platform</p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-5 w-5 mr-3 text-green-600" />
                  <span>help@circlue.ai</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-5 w-5 mr-3 text-green-600" />
                  <span>+82-31-825-6188</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3 text-green-600" />
                  <span>경기도 의정부시 문화로 10, C-1005 (한강듀클래스 의정부 고산)</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => <div key={index}>
                    <h3 className="font-semibold text-foreground mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => <li key={linkIndex}>
                          <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                            {link.name}
                          </a>
                        </li>)}
                    </ul>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Circlue.ai. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                개인정보처리방침
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                이용약관
              </a>
              <a href="#cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                쿠키 정책
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;