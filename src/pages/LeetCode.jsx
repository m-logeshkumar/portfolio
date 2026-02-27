import { motion } from 'framer-motion';
import { Card, Progress, Row, Col, Spin } from 'antd';
import {
  LinkOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const LEETCODE_USERNAME = 'logeshkumar-28';
const GRAPHQL_URL = '/leetcode-api/graphql';

// ─── GraphQL Queries ───────────────────────────
const PROFILE_QUERY = `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    badges {
      name
      displayName
      icon
      creationDate
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
  allQuestionsCount {
    difficulty
    count
  }
}`;



// ─── Fetch helper ──────────────────────────────
async function queryLeetCode(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ─── Component ─────────────────────────────────
export default function LeetCode() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await queryLeetCode(PROFILE_QUERY, { username: LEETCODE_USERNAME });
        setProfileData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load LeetCode data. Please refresh to try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derived data ─────────────────────────────
  const user = profileData?.matchedUser;
  const allQuestions = profileData?.allQuestionsCount || [];
  const acStats = user?.submitStats?.acSubmissionNum || [];
  const badges = user?.badges || [];

  const findStat = (diff) => acStats.find((s) => s.difficulty === diff) || { count: 0 };
  const findTotal = (diff) => allQuestions.find((q) => q.difficulty === diff)?.count || 0;

  const totalSolved = findStat('All').count;
  const easySolved = findStat('Easy').count;
  const mediumSolved = findStat('Medium').count;
  const hardSolved = findStat('Hard').count;
  const totalEasy = findTotal('Easy');
  const totalMedium = findTotal('Medium');
  const totalHard = findTotal('Hard');
  const totalQuestions = findTotal('All');

  // Colors
  const diffColors = { Easy: '#06d6a0', Medium: '#fbbf24', Hard: '#f72585' };

  // Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  // ── Render ───────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10"
      >
        {/* ── Header ────────────────────────── */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p
                style={{
                  color: '#06d6a0',
                  fontSize: 14,
                  fontWeight: '500',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Competitive Programming
              </p>
              <h1
                className="gradient-text"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: '800',
                  letterSpacing: '-1px',
                  margin: 0,
                }}
              >
                LeetCode Tracker
              </h1>
            </div>
            <a
              href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 12,
                background: 'rgba(6,214,160,0.1)',
                border: '1px solid rgba(6,214,160,0.2)',
                color: '#06d6a0',
                fontWeight: '600',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6,214,160,0.15)';
                e.currentTarget.style.borderColor = 'rgba(6,214,160,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(6,214,160,0.1)';
                e.currentTarget.style.borderColor = 'rgba(6,214,160,0.2)';
              }}
            >
              <LinkOutlined /> View on LeetCode
            </a>
          </div>
        </motion.div>

        {/* ── Loading / Error ────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Spin size="large" />
            <span style={{ marginLeft: 16, color: 'rgba(255,255,255,0.5)' }}>
              Fetching LeetCode data…
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p style={{ color: '#f72585', fontSize: 18 }}>{error}</p>
          </div>
        ) : (
          <>
            {/* ── Problem Breakdown + Badges ── */}
            <motion.div variants={itemVariants}>
              <Row gutter={[16, 16]} className="mb-8">
                {/* Left – Problems */}
                <Col xs={24} lg={badges.length > 0 ? 14 : 24}>
                  <Card style={{ borderRadius: 20, height: '100%' }} styles={{ body: { padding: 32 } }}>
                    <h3
                      style={{
                        color: 'rgba(255,255,255,0.92)',
                        fontSize: 20,
                        fontWeight: '700',
                        marginBottom: 32,
                      }}
                    >
                      Problems Solved
                    </h3>

                    {/* Dashboard ring */}
                    <div className="text-center mb-8">
                      <Progress
                        type="dashboard"
                        percent={totalQuestions ? Math.round((totalSolved / totalQuestions) * 100) : 0}
                        size={160}
                        strokeColor={{ '0%': '#06d6a0', '100%': '#4cc9f0' }}
                        trailColor="rgba(255,255,255,0.06)"
                        format={() => (
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 36,
                                fontWeight: '800',
                                color: '#06d6a0',
                                lineHeight: 1,
                              }}
                            >
                              {totalSolved}
                            </p>
                            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                              / {totalQuestions}
                            </p>
                          </div>
                        )}
                      />
                    </div>

                    {/* Difficulty bars */}
                    <div className="space-y-6">
                      {[
                        { label: 'Easy', solved: easySolved, total: totalEasy, color: diffColors.Easy },
                        { label: 'Medium', solved: mediumSolved, total: totalMedium, color: diffColors.Medium },
                        { label: 'Hard', solved: hardSolved, total: totalHard, color: diffColors.Hard },
                      ].map((d) => (
                        <div key={d.label}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                              <span
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  background: d.color,
                                  display: 'inline-block',
                                  boxShadow: `0 0 8px ${d.color}44`,
                                }}
                              />
                              <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: 15 }}>
                                {d.label}
                              </span>
                            </div>
                            <span style={{ color: d.color, fontWeight: '700', fontSize: 15 }}>
                              {d.solved}{' '}
                              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>/ {d.total}</span>
                            </span>
                          </div>
                          <Progress
                            percent={d.total ? Math.round((d.solved / d.total) * 100) : 0}
                            strokeColor={d.color}
                            trailColor="rgba(255,255,255,0.06)"
                            showInfo={false}
                            size={['100%', 8]}
                            style={{ margin: 0 }}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>

                {/* Right – Badges */}
                {badges.length > 0 && (
                  <Col xs={24} lg={10}>
                    <Card style={{ borderRadius: 20, height: '100%' }} styles={{ body: { padding: 32 } }}>
                      <h3
                        style={{
                          color: 'rgba(255,255,255,0.92)',
                          fontSize: 20,
                          fontWeight: '700',
                          marginBottom: 24,
                        }}
                      >
                        <SafetyCertificateOutlined style={{ color: '#fbbf24', marginRight: 8 }} />
                        Badges ({badges.length})
                      </h3>
                      <div className="flex flex-col gap-4" style={{ maxHeight: 420, overflowY: 'auto' }}>
                        {badges.map((b, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.25 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 16,
                              padding: '16px 20px',
                              borderRadius: 16,
                              background: 'rgba(251,191,36,0.05)',
                              border: '1px solid rgba(251,191,36,0.12)',
                              cursor: 'default',
                            }}
                          >
                            {b.icon ? (
                              <img
                                src={b.icon.startsWith('http') ? b.icon : `https://leetcode.com${b.icon}`}
                                alt={b.name}
                                style={{
                                  width: 56,
                                  height: 56,
                                  objectFit: 'contain',
                                  flexShrink: 0,
                                  filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.3))',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 12,
                                  background: 'rgba(251,191,36,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 28,
                                  flexShrink: 0,
                                }}
                              >
                                🏆
                              </div>
                            )}
                            <span
                              style={{
                                color: '#fbbf24',
                                fontWeight: '600',
                                fontSize: 15,
                                lineHeight: 1.4,
                              }}
                            >
                              {b.displayName || b.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
