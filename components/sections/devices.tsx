import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

const devices = [
  { name: "Apple Watch", ratio: "h-[180px] w-[150px]" },
  { name: "iPad", ratio: "h-[220px] w-[310px]" },
  { name: "iPhone", ratio: "h-[200px] w-[145px]" }
];

export function DevicesSection() {
  return (
    <SectionWrapper surface="soft">
      <Container>
        <Reveal>
          <h2 className="text-center text-3xl text-[#111f16] md:text-5xl">On your terms. Always with you.</h2>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-end justify-center gap-6 md:gap-8">
          {devices.map((device, index) => (
            <Reveal key={device.name} delay={index * 100}>
              <div className="rounded-[1.7rem] border border-[#1f3d2b]/15 bg-[#fffdf9]/90 p-4 shadow-[0_28px_62px_-48px_rgba(13,24,17,0.6)]">
                <div className={`${device.ratio} rounded-[1.3rem] bg-[#ecf1e8] p-4`}>
                  <div className="h-full rounded-xl border border-[#1f3d2b]/12 bg-white/70" />
                </div>
                <p className="mt-4 text-center text-xs tracking-[0.18em] text-[#3d5648]">{device.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
