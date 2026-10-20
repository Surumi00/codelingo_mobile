import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { getApiErrorMessage, register } from "@/api";
import { Mascot } from "@/components/mascot";
import { PrimaryButton } from "@/components/primary-button";
import {
  initialRegisterInput,
  validate,
  type RegisterErrors,
} from "@/features/auth";
import { authFormStyles as styles } from "@/features/auth/components/auth-form-styles";
import type { SignedOutStackParamList } from "@/navigation/types";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<SignedOutStackParamList, "Register">;

const REDIRECT_DELAY_MS = 1400;

export function RegisterScreen({ navigation }: Props) {
  const [input, setInput] = useState(initialRegisterInput);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitGuard = useRef(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    },
    [],
  );

  const setField = (
    field: keyof typeof initialRegisterInput,
    value: string,
  ) => {
    setInput((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  };

  const handleSubmit = async () => {
    if (submitGuard.current) {
      return;
    }

    const validationErrors = validate(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("Please fix the highlighted fields.");
      return;
    }

    submitGuard.current = true;
    setStatus("");
    setIsSubmitting(true);

    try {
      await register({
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
      });

      setNotice("Registration successful! You can now log in.");
      redirectTimer.current = setTimeout(() => {
        navigation.navigate("Login");
      }, REDIRECT_DELAY_MS);
    } catch (error) {
      setStatus(getApiErrorMessage(error, "Registration failed."));
      setIsSubmitting(false);
      submitGuard.current = false;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.hero}>
          <Mascot mood="excited" size={100} />
          <Text style={styles.heroTitle}>{"Let's get\nyou set up."}</Text>
        </View>

        <View style={styles.card}>
          <View>
            <Text style={styles.heading}>Create your account</Text>
            <Text style={styles.subheading}>Takes about a minute.</Text>
          </View>

          {notice ? (
            <View style={styles.notice}>
              <Text
                style={styles.noticeText}
                accessibilityLiveRegion="polite"
                role="alert"
              >
                {notice}
              </Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={input.name}
              onChangeText={(value) => setField("name", value)}
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Ada Lovelace"
              placeholderTextColor={colors.text}
              autoCapitalize="words"
              textContentType="name"
              autoComplete="name"
              returnKeyType="next"
              editable={!isSubmitting}
            />
            {errors.name ? (
              <Text style={styles.fieldError}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={input.email}
              onChangeText={(value) => setField("email", value)}
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="you@example.com"
              placeholderTextColor={colors.text}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="next"
              editable={!isSubmitting}
            />
            {errors.email ? (
              <Text style={styles.fieldError}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={input.password}
              onChangeText={(value) => setField("password", value)}
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="At least 8 characters"
              placeholderTextColor={colors.text}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="go"
              editable={!isSubmitting}
              onSubmitEditing={() => {
                void handleSubmit();
              }}
            />
            {errors.password ? (
              <Text style={styles.fieldError}>{errors.password}</Text>
            ) : null}
          </View>

          <PrimaryButton
            label="Continue →"
            onPress={() => {
              void handleSubmit();
            }}
            loading={isSubmitting}
          />

          {status ? (
            <Text
              style={styles.status}
              accessibilityLiveRegion="polite"
              role="alert"
            >
              {status}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable
              onPress={() => navigation.navigate("Login")}
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
