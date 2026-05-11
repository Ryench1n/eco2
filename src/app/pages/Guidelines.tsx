import { motion } from "motion/react";
import {
  BookOpen,
  CreditCard,
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export function Guidelines() {
  const bookingSteps = [
    {
      step: 1,
      title: "Тоглоомын төв хайх",
      description: "Манай тоглоомын төвүүдээс сонгож, эсвэл ойролцоох төвийг хайлтаар олоорой.",
      icon: "🔍",
    },
    {
      step: 2,
      title: "Дэлгэрэнгүй ба үнэлгээ үзэх",
      description: "Төхөөрөмж, үзүүлэлт, үнэлгээ болон үнийг захиалахаас өмнө шалгана уу.",
      icon: "⭐",
    },
    {
      step: 3,
      title: "Огноо ба цаг сонгох",
      description: "Таны сонгосон огноо, цагийн хуваарь болон тоглох хугацааг сонгоно уу.",
      icon: "📅",
    },
    {
      step: 4,
      title: "Суудал сонгох",
      description: "Таны сонголтод тулгуурлан Hall, VIP эсвэл Stage суудлаас сонгоно уу.",
      icon: "🪑",
    },
    {
      step: 5,
      title: "Баталгаажуулж төлбөр төлөх",
      description: "Захиалгын дэлгэрэнгүйг шалгаж, төлбөрөө хийснээр баталгаажуулна уу.",
      icon: "💳",
    },
  ];

  const guidelines = [
    {
      title: "Цуцлалтын журам",
      icon: XCircle,
      color: "text-red-500",
      rules: [
        "Захиалга эхлэхээс 24 цагийн өмнө үнэгүй цуцлах боломжтой",
        "12-24 цагийн өмнө цуцлавал 50% буцаан олгоно",
        "12 цаг хүрэхгүй хугацаанд цуцлавал буцаан олгохгүй",
        "Яаралтай тохиолдолд тоглоомын төвтэй шууд холбогдоно уу",
      ],
    },
    {
      title: "Төлбөрийн журам",
      icon: CreditCard,
      color: "text-green-500",
      rules: [
        "Бүх төлбөрийг ECO платформоор дамжуулан хийнэ",
        "Зөвшөөрөгдсөн төлбөрийн хэрэгсэл: Карт, Qpay",
        "Үнэ нь цагаар тооцогдож, суудлын төрлөөс хамаарна (Hall/VIP/Stage)",
        "Баримт нь таны бүртгэлтэй имэйл хаягт автоматаар илгээгдэнэ",
      ],
    },
    {
      title: "Хэрэглэгчийн дүрэм",
      icon: Users,
      color: "text-purple-500",
      rules: [
        "Бусад тоглогчдыг хүндэтгэж, соёлтой байх",
        "Аливаа асуудал гарвал ажилтнуудад шууд мэдэгдэх",
        "Тоглоомын төвийн дотоод журмыг дагаж мөрдөх",
      ],
    },
    {
      title: "Тоглоомын төвийн дүрэм",
      icon: Shield,
      color: "text-cyan-500",
      rules: [
        "Захиалсан цагтаа цаг алдалгүй ирэх",
        "Төвөөс зөвшөөрөөгүй бол гадны хоол, ундаа оруулахгүй байх",
        "Төхөөрөмжийг болгоомжтой ашиглах - эвдрэл гарвал хохирлыг барагдуулах",
        "Зөвшөөрөлгүй программ эсвэл тоглоом суулгахгүй байх",
      ],
    },
  ];

  const faqs = [
    {
      question: "Бүртгэл хэрхэн үүсгэх вэ?",
      answer:
        "Навигацийн самбар дээрх 'Нэвтрэх' товч дээр дарж, 'Бүртгүүлэх'-ийг сонгоно уу. Нэр, имэйл, нууц үгээ оруулна уу. Имэйл дээр баталгаажуулах код ирэх ба түүгээр бүртгэлээ идэвхжүүлнэ.",
    },
    {
      question: "Баталгаажсан захиалгаа өөрчилж болох уу?",
      answer:
        "Тийм, захиалга эхлэхээс 12 цагийн өмнө өөрчилж болно. Профайл руугаа орж, захиалгаа олоод 'Өөрчлөх' дээр дарна уу. Суудлын боломж өөрчлөгдсөн байж болно гэдгийг анхаарна уу.",
    },
    {
      question: "Захиалгадаа хоцорвол яах вэ?",
      answer:
        "Таны захиалсан цаг хэдийд ирсэнээс үл хамааран эхэлнэ. Хоцорч байвал тоглоомын төвтэй шууд холбогдоно уу. Нэмэлт төлбөргүйгээр цагийг сунгах боломжгүй.",
    },
    {
      question: "Насны хязгаарлалт байдаг уу?",
      answer:
        "Ихэнх тоглоомын төвүүд 13 ба түүнээс дээш насны хэрэглэгчдийг зөвшөөрдөг. Насанд хүрээгүй хүүхдүүдэд эцэг эхийн зөвшөөрөл шаардлагатай байж болно. Төв бүрийн дүрэм өөр өөр байх тул шалгана уу.",
    },
    {
      question: "Hall, VIP, Stage суудлын ялгаа юу вэ?",
      answer:
        "Hall суудал нь үзүүлэлт сайтай зааланд байрлах суудал юм. VIP суудал нь үзүүлэлт сайтай, илүү тав тухтай, тусгай өрөөны суудал юм. Stage суудал нь хамгийн шилдэг төхөөрөмжүүдтэй, ихэвчлэн стрийм хийх боломжтой тусгай өрөөны суудал юм.",
    },
    {
      question: "Өөрийн гар, хулгана авчирч болох уу?",
      answer:
        "Ихэнх төвүүд өөрийн гар, хулгана, чихэвч авчрахыг зөвшөөрдөг.",
    },
    {
      question: "Техникийн асуудал гарвал яах вэ?",
      answer:
        "Шууд ажилтнуудад мэдэгдэнэ үү. Тэд танд туслах эсвэл өөр суудал руу шилжүүлэх болно. Хэрэв асуудал таны тоглолтод их нөлөөлвөл цаг сунгах эсвэл буцаан олголт авах боломжтой.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full mb-6 border border-purple-500/30">
            <BookOpen className="size-12 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Заавар ба тусламж
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            ECO тоглоомын төвүүдийг захиалж, ашиглахтай холбоотой бүх мэдээлэл
          </p>
        </motion.div>

        {/* How to Book Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-[#1a1a24] border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <CheckCircle className="size-7 text-green-500" />
                Тоглоомын захиалга хэрхэн хийх вэ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {bookingSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="relative"
                  >
                    <div className="bg-[#0f0f17] rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all h-full">
                      <div className="text-4xl mb-3">{step.icon}</div>
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 mb-3">
                        Алхам {step.step}
                      </Badge>
                      <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                    {index < bookingSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ChevronDown className="size-6 text-purple-500 rotate-[-90deg]" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guidelines.map((guideline, index) => (
            <motion.div
              key={guideline.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <guideline.icon className={`size-6 ${guideline.color}`} />
                    {guideline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {guideline.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="size-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Чухал анхааруулга</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock className="size-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Оргил цагууд (амралт, орой) урьдчилан захиалга шаардлагатай</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="size-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Зарим тоглоомын төвд үнэмлэх шаардлагатай байж болно</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard className="size-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Захиалгын баталгаажуулалтаа хадгална уу</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-[#1a1a24] border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <HelpCircle className="size-7 text-purple-500" />
                Түгээмэл асуултууд
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-purple-500/20"
                  >
                    <AccordionTrigger className="text-white hover:text-purple-400 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-purple-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-3">Асуулт байсаар байна уу?</h3>
              <p className="text-gray-300 mb-6">
                Манай баг танд туслахад үргэлж бэлэн байх болно
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:support@eco-gaming.mn" className="text-purple-400 hover:text-purple-300 transition-colors">
                  support@eco-gaming.mn
                </a>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <a href="tel:+97677770000" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  +976 7777-0000
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
