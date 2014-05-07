/* Copyright (c) 2014 Intel Corporation. All rights reserved.
 * Use of this source code is governed by an Apache v2 license that can be
 * found in the LICENSE-APACHE-V2 file. */
package org.crosswalkproject.sample;

import java.util.List;

public class Response {
  public String id;
  public boolean success;
  public List<FileInfo> files;

  public Response(String id, boolean success, List<FileInfo> files) {
    this.id = id;
    this.success = success;
    this.files = files;
  }
}
