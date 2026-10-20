import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { getApiErrorMessage, login } from "@/api";
import { Mascot } from "@/components/mascot";
import { PrimaryButton } from "@/components/primary-button";
import { useAuth } from "@/features/auth";
import { authFormStyles as styles } from "@/features/auth/components/auth-form-styles";
import type { SignedOutStackParamList } from "@/navigation/types";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<SignedOutStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitGuard = useRef(false);

  const handleSubmit = async () => {
    if (submitGuard.current) {
      return;
    }

    if (!email.trim() || !password) {
      setStatus("Email and password are required.");
      return;
    }

    submitGuard.current = true;
    setStatus("");
    setIsSubmitting(true);

    try {
      const { token } = await login({ email: email.trim(), password });
      await signIn(token);
    } catch (error) {
      setStatus(getApiErrorMessage(error, "Login failed."));
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
          <Mascot mood="hi" size={100} />
        </View>

        <View style={styles.card}>
          <View>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Log in to continue your path.</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
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
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.text}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              textContentType="password"
              autoComplete="current-password"
              returnKeyType="go"
              editable={!isSubmitting}
              onSubmitEditing={() => {
                void handleSubmit();
              }}
            />
          </View>

          <PrimaryButton
            label="Log in →"
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
            <Text style={styles.footerText}>New here?</Text>
            <Pressable
              onPress={() => navigation.navigate("Register")}
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
