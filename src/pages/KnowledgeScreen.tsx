// src/pages/KnowledgeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  Database,
  CheckCircle,
  AlertCircle,
  Info,
  Rss,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { NEWS_SOURCES } from "../config/api";
import { useKnowledge } from "../hooks/useKnowledge";

export const KnowledgeScreen: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState("");
  const { isLoading, response, addKnowledge, clearResponse } = useKnowledge();

  // Clear response when source changes
  useEffect(() => {
    if (response) {
      clearResponse();
    }
  }, [selectedSource, clearResponse]);

  const handleAddKnowledge = () => {
    if (selectedSource) {
      addKnowledge(selectedSource);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-green-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Database className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Knowledge Management
            </h1>
            <p className="text-sm text-gray-500">
              Enhance the AI with latest news sources
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center space-x-3">
                <Rss className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Knowledge from RSS Feed
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label
                  htmlFor="source"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Select News Source
                </label>
                <select
                  id="source"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  disabled={isLoading}
                >
                  <option value="">Choose a news source...</option>
                  {NEWS_SOURCES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleAddKnowledge}
                disabled={!selectedSource}
                isLoading={isLoading}
                variant="primary"
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Ingest Latest Articles
              </Button>

              {/* Response */}
              {response && (
                <div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    response.error
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {response.error ? (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          response.error ? "text-red-800" : "text-green-800"
                        }`}
                      >
                        {response.error ? "Error" : "Success"}{" "}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          response.error ? "text-red-700" : "text-green-700"
                        }`}
                      >
                        {response.error || response.message}
                      </p>
                      {response &&
                        response.articles &&
                        response.articles.length > 0 && (
                          <div className="list-disc list-inside mt-2 flex flex-col">
                            {response.articles.map((article, index) => (
                              <a
                                key={index}
                                className="text-sm text-gray-700"
                                href={article.link}
                                target="_blank"
                              >
                                {article.title}
                              </a>
                            ))}
                          </div>
                        )}
                      {response &&
                        response.articles &&
                        response.articles.length === 0 && (
                          <p className="text-sm text-gray-700">
                            No new articles found.
                          </p>
                        )}

                      {response &&
                        response.articles &&
                        response.articles.length > 0 && (
                          <p className="text-xs mt-2 text-black">
                            Please wait for some time (max 1 min, have added
                            delay of 5s between each article processing as well
                            to avoid rate limits) before querying for the
                            related articles
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">
                      How it works
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Select a news source to fetch the latest articles. These
                      articles are processed asynchronously with message queue,
                      vectorized, and stored in the knowledge base for the AI
                      assistant.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-purple-900 mb-2">
                      Processing Pipeline
                    </h3>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      Articles are fetched from RSS feeds, chunked, embedded
                      using Jina embeddings, and stored in a vector database for
                      fast semantic search during conversations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Sources */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Available News RSS feeds (Can add more later)
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {NEWS_SOURCES.map((source) => (
                  <div
                    key={source.value}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Rss className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {source.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
