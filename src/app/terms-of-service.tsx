import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <PageScrollView
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      <TextSemiBold style={{ fontSize: 24, marginBottom: 12 }}>
        Terms of Service
      </TextSemiBold>

      <TextRegular style={{ marginBottom: 8 }}>
        Last Updated: May 19, 2025
      </TextRegular>

      <TextRegular style={{ marginBottom: 12 }}>
        Welcome to DRX GENIUS LLC (“Company”, “we”, “us”, or “our”). These Terms
        of Service (“Terms”) govern your use of our mobile telehealth app and
        related services (collectively, the “Service”). By accessing or using
        the Service, you agree to be bound by these Terms.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>1. Eligibility</TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        You must be at least 18 years old to use the Service. By using the app,
        you confirm that you meet this requirement.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>
        2. Medical Disclaimer
      </TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        Our Service connects users with licensed healthcare professionals.
        However, the information provided is not a substitute for in-person
        medical diagnosis or treatment. In case of emergency, call 911 or go to
        the nearest hospital.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>
        3. User Responsibilities
      </TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        You agree to provide accurate and complete information and to use the
        Service in accordance with all applicable laws. You are responsible for
        maintaining the confidentiality of your account.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>4. Privacy</TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        We care about your privacy. Please review our Privacy Policy to
        understand how we collect, use, and protect your information.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>
        5. Intellectual Property
      </TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        All content and materials provided through the Service are owned by DRX
        GENIUS LLC or its licensors and are protected by intellectual property
        laws.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>6. Termination</TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        We reserve the right to suspend or terminate your access to the Service
        at our discretion, without notice, if you violate these Terms or misuse
        the Service.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>
        7. Disclaimers & Limitation of Liability
      </TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        The Service is provided “as is” without warranties of any kind. To the
        fullest extent permitted by law, DRX GENIUS LLC disclaims all liability
        for any indirect, incidental, or consequential damages arising out of
        your use of the Service.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>
        8. Changes to Terms
      </TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        We may update these Terms at any time. Continued use of the Service
        constitutes acceptance of the updated Terms.
      </TextRegular>

      <TextSemiBold style={{ marginBottom: 4 }}>9. Contact Us</TextSemiBold>
      <TextRegular style={{ marginBottom: 12 }}>
        If you have any questions about these Terms, contact us at
        support@dr-x.com.
      </TextRegular>
    </PageScrollView>
  );
}
