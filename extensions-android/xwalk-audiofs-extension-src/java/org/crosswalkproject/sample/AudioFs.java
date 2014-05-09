/* Copyright (c) 2014 Intel Corporation. All rights reserved.
 * Use of this source code is governed by an Apache v2 license that can be
 * found in the LICENSE-APACHE-V2 file. */
package org.crosswalkproject.sample;

import org.xwalk.app.runtime.extension.XWalkExtensionClient;
import org.xwalk.app.runtime.extension.XWalkExtensionContextClient;
import java.util.List;
import java.util.ArrayList;
import com.google.gson.Gson;
import android.content.ContentResolver;
import android.database.Cursor;

public class AudioFs extends XWalkExtensionClient {
  private ContentResolver resolver;
  private Gson gson = new Gson();

  public AudioFs(String name, String jsApiContent, XWalkExtensionContextClient xwalkContext) {
    super(name, jsApiContent, xwalkContext);
    this.resolver = xwalkContext.getContext().getContentResolver();
  }

  private String listFiles(String requestId) {
    // columns to retrieve
    String[] projection = {
      android.provider.MediaStore.Audio.Media.DATA,
      android.provider.MediaStore.Audio.Media.TITLE,
      android.provider.MediaStore.Audio.Media.ARTIST
    };

    Cursor audioCursor = this.resolver.query(
      android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      projection,
      null, // selection
      null, // selectionArgs
      null  // sortOrder
    );

    // build the list of file objects
    List<FileInfo> files = new ArrayList<FileInfo>();

    if (audioCursor != null && audioCursor.moveToFirst()) {
      do {
        // columns are ordered as in projection array
        files.add(new FileInfo(
          audioCursor.getString(0), // uri
          audioCursor.getString(1), // title
          audioCursor.getString(2)  // artist
        ));
      }
      while (audioCursor.moveToNext());
    }

    Response resp = new Response(requestId, true, files);

    return gson.toJson(resp);
  }

  @Override
  public void onMessage(int instanceId, String requestId) {
    postMessage(instanceId, listFiles(requestId));
  }

  @Override
  public String onSyncMessage(int instanceId, String requestId) {
    return listFiles(requestId);
  }
}
