import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import {
  getApiErrorMessage,
  getDiagnosticResult as getRemoteDiagnosticResult,
  getMe,
  type DiagnosticSubmitResponse,
  type User,
} from "@/api";
import { PrimaryButton } from "@/components/primary-button";
import { useAuth } from "@/features/auth";
import {
  getInitials,
  normalizeDiagnosis,
  type Diagnosis,
} from "@/features/profile";
import { ProfileConceptList } from "@/features/profile/components/profile-concept-list";
import { ProfileRadar } from "@/features/profile/components/profile-radar";
import { profileStyles as styles } from "@/features/profile/components/profile-styles";
import { formatLevelLabel } from "@/features/syllabus";
import type { SignedInStackParamList } from "@/navigation/types";
import { getDiagnosticResult as getSavedDiagnosticResult } from "@/storage";
import { colors, gradients } from "@/theme";

type Props = NativeStackScreenProps<SignedInStackParamList, "Profile">;

type LoadState = "loading" | "ready" | "error";

export function ProfileScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const nextUser = await getMe();

        if (!isMounted.current) {
          return;
        }

        setUser(nextUser);

        let remoteResult: DiagnosticSubmitResponse | null = null;

        try {
          remoteResult = await getRemoteDiagnosticResult();
        } catch {
          remoteResult = null;
        }

        const savedResult = remoteResult ?? (await getSavedDiagnosticResult());

        if (!isMounted.current) {
          return;
        }

        setDiagnosis(normalizeDiagnosis(savedResult));
        setLoadState("ready");
      } catch (error) {
        if (!isMounted.current) {
          return;
        }

        setLoadError(
          getApiErrorMessage(
            error,
            "We could not load your profile. Please try again.",
          ),
        );
        setLoadState("error");
      }
    })();
  }, [loadAttempt]);

  const handleRetry = () => {
    setLoadError("");
    setLoadState("loading");
    setLoadAttempt((currentAttempt) => currentAttempt + 1);
  };

  if (loadState === "loading") {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <ActivityIndicator color={colors.accentSoft} size="large" />
            <Text style={styles.stateText}>Loading profile…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (loadState === "error") {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Profile unavailable</Text>
            <Text style={styles.stateText}>{loadError}</Text>
            <PrimaryButton label="Retry" onPress={handleRetry} />
          </View>
        </View>
      </View>
    );
  }

  const name = user?.name?.trim() ?? "";
  const email = user?.email?.trim() ?? "";
  const language = formatLevelLabel(user?.language) || "Python";
  const summaryLevel = diagnosis
    ? formatLevelLabel(diagnosis.level)
    : "Beginner";
  const initials = getInitials(name);
  const rows = [
    { label: "Name", value: name || "Your Name" },
    { label: "Email", value: email || "your@email.com" },
    { label: "Language Chosen", value: language },
    {
      label: "Diagnostic Taken",
      value: diagnosis
        ? `${diagnosis.questionsAnswered} questions`
        : "Not yet taken",
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.shell}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>Your profile</Text>
          <Text style={styles.title}>
            {diagnosis
              ? "Diagnostic complete — here's what Coda found."
              : "Welcome to your profile"}
            <Text style={styles.titleAccent}> Your path starts now.</Text>
          </Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryIdentity}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>

            <View style={styles.identity}>
              <Text style={styles.identityName}>{name || "Your Name"}</Text>
              <Text style={styles.identityEmail}>
                {email || "your@email.com"}
              </Text>
              <View style={styles.levelTag}>
                <Text style={styles.levelTagText}>
                  {`${language} · ${summaryLevel}`}
                </Text>
              </View>
            </View>
          </View>

          {diagnosis ? (
            <View style={styles.score}>
              <Text style={styles.scoreValue}>
                {`${diagnosis.score}/${diagnosis.scoreTotal}`}
              </Text>
              <Text style={styles.scoreLabel}>diagnostic score</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About You</Text>
          <View style={styles.rowList}>
            {rows.map((row) => (
              <View key={row.label} style={styles.rowItem}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            ))}
            <View style={[styles.rowItem, styles.rowItemLast]}>
              <Text style={styles.rowLabel}>Level Assigned</Text>
              <View style={styles.levelPill}>
                <Text style={styles.levelPillText}>
                  {diagnosis ? formatLevelLabel(diagnosis.level) : "Pending"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {diagnosis ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Skill Radar</Text>
            <View style={styles.radarWrap}>
              <ProfileRadar concepts={diagnosis.concepts} />
            </View>
          </View>
        ) : null}

        {diagnosis ? (
          <>
            <View style={styles.insightBanner}>
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.insightMark}
              >
                <Text style={styles.insightMarkText}>C</Text>
              </LinearGradient>
              <Text style={styles.insightText}>{diagnosis.insight}</Text>
            </View>

            <View style={styles.breakdownSection}>
              <Text style={styles.cardTitle}>
                Concept breakdown from your diagnostic
              </Text>
              <ProfileConceptList concepts={diagnosis.concepts} />
            </View>
          </>
        ) : (
          <View style={styles.pendingState}>
            <Text style={styles.pendingTitle}>No diagnostic yet</Text>
            <Text style={styles.pendingText}>
              Complete your first diagnostic to unlock your skill radar,
              insights, and concept breakdown.
            </Text>
            <PrimaryButton
              label="Start Diagnostic →"
              onPress={() => navigation.navigate("Diagnostic")}
            />
          </View>
        )}

        <PrimaryButton
          label="Log out"
          onPress={() => {
            void signOut();
          }}
        />
      </View>
    </ScrollView>
  );
}
