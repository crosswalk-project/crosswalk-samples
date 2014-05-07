/* Copyright (c) 2014 Intel Corporation. All rights reserved.
 * Use of this source code is governed by an Apache v2 license that can be
 * found in the LICENSE-APACHE-V2 file. */
package org.crosswalkproject.sample;

public class FileInfo {
  public String uri;
  public String title;
  public String artist;

  public FileInfo(String path, String title, String artist) {
    this.uri = path;
    this.title = title;
    this.artist = artist;
  }
}
