"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, BookOpen, Users, ArrowRight, Github } from "lucide-react";
import { AnimatedDatabasePattern } from "@/components/magicui/animated-grid-pattern";

export default function Home() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-300">
      {/* Animated background */}
      <div className="fixed inset-y-0 left-0 pl-20 pointer-events-none">
        <AnimatedDatabasePattern
          className="ml-0"
          numTables={24}
          maxOpacity={0.08}
          duration={5}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Hero Section */}
        <motion.div
          className="w-full py-20 px-8 flex justify-end"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="max-w-3xl text-right">
            <h2 className="text-6xl font-semibold mb-2 text-cyan-500">DBQuill</h2>
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-cyan-500">
              Mini Database Manager
              <span className="block border-b-2 border-cyan-500 inline-block mt-2 pb-1 text-gray-300">
                File Organization & Indexing
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-10">
              Group project to develop an efficient system for file organization,
              indexing, and query processing
            </p>

            <div className="flex justify-end gap-6">
              <Button
                onClick={() => router.push("/interface_db")}
                className="bg-gray-700 text-gray-300 hover:bg-cyan-500 hover:text-black hover:scale-105 transition-transform text-lg px-6 py-3"
              >
                See Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-cyan-500 hover:text-black hover:scale-105 transition-transform text-lg px-6 py-3"
                onClick={() =>
                  window.open(
                    "https://github.com/GinoDazaU/base-de-datos-2-proyecto",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                GitHub Repository <Github className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="w-full bg-gray-900 bg-opacity-95 border-t border-gray-700 py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-16 text-cyan-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="border-b-2 border-cyan-500 inline-block pb-1">
                Project Features
              </span>{" "}
              of the Mini Database Manager
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeIn}>
                <Card className="bg-gray-800 shadow-lg hover:shadow-xl transition-shadow rounded-none border-none">
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="p-3 bg-gray-900 mb-4">
                      <Code className="h-6 w-6 " />
                    </div>
                    <CardTitle className="text-xl text-center ">
                      File Organization Techniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-8">
                    <CardDescription className="text-gray-400">
                      Implementation of efficient file organization methods
                      including Sequential Files, AVL, ISAM, Extendible Hashing,
                      B+ Trees, and R-Trees
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="bg-gray-800 shadow-lg hover:shadow-xl transition-shadow rounded-none border-none">
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="p-3 bg-gray-900 mb-4">
                      <BookOpen className="h-6 w-6 " />
                    </div>
                    <CardTitle className="text-xl text-center ">
                      Search & Modification Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-8">
                    <CardDescription className="text-gray-400">
                      Support for specific key search, range queries, insertion,
                      and deletion algorithms adapted for each file organization
                      technique
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="bg-gray-800 shadow-lg hover:shadow-xl transition-shadow rounded-none border-none">
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="p-3 bg-gray-900 mb-4">
                      <Users className="h-6 w-6 " />
                    </div>
                    <CardTitle className="text-xl text-center ">
                      SQL Parser & User Interface
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-8">
                    <CardDescription className="text-gray-400">
                      SQL code parser translating commands into executable
                      statements with a user-friendly interface to display
                      results clearly
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* About the Course Section */}
        <div className="w-full py-24 bg-gray-900 bg-opacity-95 border-t border-gray-700">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 text-cyan-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="border-b-2 border-cyan-500 inline-block pb-1">
                About
              </span>{" "}
              the Course
            </motion.h2>

            <motion.div
              className="bg-gray-800 rounded-none shadow-lg p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 ">
                CS2702 - Databases II
              </h3>
              <p className="text-gray-400 mb-8">
                The Databases II course is a core subject in the Computer Science
                curriculum. It focuses on advanced techniques for efficient data
                organization and management, including physical file structures
                and multidimensional indexing methods.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="font-bold mb-4 border-b border-cyan-500 pb-2">
                    Course Objectives:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>
                      Understand and implement file organization techniques for
                      secondary storage
                    </li>
                    <li>
                      Develop operations such as insertion, deletion, and search
                      optimized for different data structures
                    </li>
                    <li>
                      Apply multidimensional indexing structures like R-Trees for
                      complex data
                    </li>
                    <li>Implement a SQL parser and execute queries efficiently</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-4 border-b border-cyan-500 pb-2">
                    Main Topics:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Sequential File and AVL File structures</li>
                    <li>ISAM Sparse Indexing (two-level)</li>
                    <li>Extendible Hashing and B+ Trees</li>
                    <li>R-Trees and multidimensional data indexing</li>
                    <li>SQL Parsing and query execution</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-black text-gray-500 py-12 border-t border-gray-700">
          <motion.div
            className="container mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="mb-4">
              Databases II Course Project - University of Engineering and
              Technology
            </p>
            <p className="text-sm">© 2025 - Computer Science Department</p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
