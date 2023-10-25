"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState({
    type: "",
    slug: "",
    name: "",
    path: "",
    config: { fields: new Map() },
  });

  const [items, setItems] = useState<string[]>([]);
  const [listItems, setListItems] = useState<Map<string, any>>(new Map());
  const [allItems, setAllItems] = useState<
    (string | { type: string; value: string })[]
  >([]);

  const handleItemClick = (type: string) => {
    const timestamp = Date.now();
    const uniqueType = `${type}_${timestamp}`;

    if (type === "list") {
      setListItems((prevListItems) => {
        const newListItems = new Map(prevListItems);
        newListItems.set(uniqueType, []);
        return newListItems;
      });
      setAllItems((prevAllItems) => [
        ...prevAllItems,
        { type: "list", value: uniqueType },
      ]);
    } else {
      setItems((prevItems: string[]) => [...prevItems, uniqueType]);
      setAllItems((prevAllItems) => [...prevAllItems, uniqueType]);
    }

    setOutput((prevOutput) => {
      const newFields = new Map(prevOutput.config.fields);
      newFields.set(uniqueType, {
        type: type,
        label: {
          en: "", // Replace with the actual label
        },
        ...(type === "list" ? { fields: {} } : {}),
      });
      return {
        ...prevOutput,
        config: {
          ...prevOutput.config,
          fields: newFields,
        },
      };
    });
  };

  // Input label color map
  const fieldTypeColors = {
    string: {
      bg: "bg-rose-500/10",
      text: "text-rose-600",
    },
    text: {
      bg: "bg-sky-500/10",
      text: "text-sky-600",
    },
    wysiwyg: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
    },
    url: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
    },
    image: {
      bg: "bg-violet-500/10",
      text: "text-violet-600",
    },
  };

  return (
    <main className="flex flex-col items-center w-full bg-slate-50">
      <section className="flex justify-center w-full gap-8 px-4 min-h-[calc(100vh+100vh)]">
        <div className="min-h-screen w-[60%] bg-white border border-gray-100 mt-8 rounded-t-lg">
          <div className="flex gap-4 p-4">
            <div>
              <Label htmlFor="docType">Document Type</Label>
              <Select
                onValueChange={(value) =>
                  setOutput((prevOutput) => ({ ...prevOutput, type: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                type="text"
                id="slug"
                placeholder="slug"
                onChange={(event) =>
                  setOutput((prevOutput) => ({
                    ...prevOutput,
                    slug: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="name">Title</Label>
              <Input
                type="text"
                id="name"
                placeholder="Title"
                onChange={(event) =>
                  setOutput((prevOutput) => ({
                    ...prevOutput,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="path">Path</Label>
              <Input
                type="text"
                id="path"
                placeholder="/"
                onChange={(event) =>
                  setOutput((prevOutput) => ({
                    ...prevOutput,
                    path: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="px-4 pb-3">
            <Separator />
          </div>
          <div className="flex flex-col gap-2 px-4 py-2">
            {allItems.map((item, index) => {
              const value = typeof item === "string" ? item : item.value;
              const fieldType = output.config.fields.get(value)?.type;
              const colors =
                fieldTypeColors[fieldType as keyof typeof fieldTypeColors];
              return (
                <div key={index} className="relative cursor-auto select-select">
                  <span
                    className={`absolute px-[10px] py-[2px] text-xs -translate-y-1/2 rounded-full right-2 top-1/2 ${colors?.bg} ${colors?.text}`}
                  >
                    {fieldType}
                  </span>
                  <div className="flex items-center gap-1 cursor-grab active:cursor-grabbing">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="row-grabber"
                    >
                      <path
                        fill="#E4E6EA"
                        d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z"
                      />
                    </svg>
                    <Input
                      type="text"
                      value={value}
                      onChange={(event) => {
                        const newValue = event.target.value.replace(/\s/g, "_"); // Replace spaces with underscores

                        setOutput((prevOutput) => {
                          const newFields = new Map();
                          for (const [key, field] of Array.from(
                            prevOutput.config.fields.entries()
                          )) {
                            if (key === value) {
                              newFields.set(newValue, field);
                            } else {
                              newFields.set(key, field);
                            }
                          }
                          return {
                            ...prevOutput,
                            config: {
                              ...prevOutput.config,
                              fields: newFields,
                            },
                          };
                        });

                        if (typeof item === "string") {
                          setItems((prevItems) =>
                            prevItems.map((prevItem) =>
                              prevItem === value ? newValue : prevItem
                            )
                          );
                          setAllItems((prevAllItems) =>
                            prevAllItems.map((prevItem) =>
                              prevItem === value ? newValue : prevItem
                            )
                          );
                        } else {
                          setListItems(
                            (prevListItems) =>
                              new Map(
                                Array.from(prevListItems.entries()).map(
                                  ([prevKey, prevValue]) =>
                                    prevKey === value
                                      ? [newValue, prevValue]
                                      : [prevKey, prevValue]
                                )
                              )
                          );
                        }
                      }}
                      onBlur={(event) => {
                        let newValue = event.target.value;
                        if (newValue === "") {
                          // If input is empty on unfocus
                          const uniqueValue = `${fieldType}_${Date.now()}`; // Create a unique value based on fieldType and current timestamp
                          newValue = uniqueValue; // Set the input value to the unique value
                        }
                        newValue = newValue.replace(/\s/g, "_"); // Replace spaces with underscores
                        event.target.value = newValue; // Update the input value

                        setOutput((prevOutput) => {
                          const newFields = new Map(prevOutput.config.fields);
                          newFields.set(newValue, newFields.get(value)); // Update the value in the fields map
                          newFields.delete(value); // Remove the old value from the fields map

                          return {
                            ...prevOutput,
                            config: {
                              ...prevOutput.config,
                              fields: newFields,
                            },
                          };
                        });

                        if (typeof item === "string") {
                          setItems((prevItems) =>
                            prevItems.map((prevItem) =>
                              prevItem === value ? newValue : prevItem
                            )
                          );
                          setAllItems((prevAllItems) =>
                            prevAllItems.map((prevItem) =>
                              prevItem === value ? newValue : prevItem
                            )
                          );
                        } else {
                          setListItems(
                            (prevListItems) =>
                              new Map(
                                Array.from(prevListItems.entries()).map(
                                  ([prevKey, prevValue]) =>
                                    prevKey === value
                                      ? [newValue, prevValue]
                                      : [prevKey, prevValue]
                                )
                              )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-h-screen w-[40%] bg-slate-100 border- border-gray-50 mt-8 rounded-t-lg text-xs text-slate-700 p-4 pb-32">
          <pre>
            {JSON.stringify(
              {
                ...output,
                config: {
                  ...output.config,
                  fields: Object.fromEntries(output.config.fields),
                },
              },
              null,
              2
            )}
          </pre>{" "}
        </div>
      </section>
      <section className="fixed bottom-0 left-0 flex items-center justify-center w-full h-24 gap-8 text-gray-500 border-t rounded-t-xl border-slate-100 bg-gray-400/20 backdrop-blur-lg">
        <div
          className="cursor-pointer select-none"
          onClick={() => handleItemClick("string")}
        >
          STRING
        </div>
        <div
          className="cursor-pointer select-none"
          onClick={() => handleItemClick("text")}
        >
          TEXT
        </div>
        <div
          className="cursor-pointer select-none"
          onClick={() => handleItemClick("wysiwyg")}
        >
          WYSIWYG
        </div>
        <div
          className="cursor-pointer select-none"
          onClick={() => handleItemClick("url")}
        >
          URL
        </div>
        <div
          className="cursor-pointer select-none"
          onClick={() => handleItemClick("image")}
        >
          IMAGE
        </div>
        <div
          className="cursor-pointer select-none"
          onClick={() => handleItemClick("list")}
        >
          LIST
        </div>
      </section>
    </main>
  );
}
